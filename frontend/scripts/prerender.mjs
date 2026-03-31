import { createServer } from "node:http";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { getSeoEntries } from "./seo-routes.mjs";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");
const PRERENDER_EVENT = "dubai:prerender-ready";
const PRERENDER_TIMEOUT_MS = 4000;
const PRERENDER_STATUS_KEY = "__DUBAI_PRERENDER_STATUS";
const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH?.trim();

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function getContentType(filePath) {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

async function resolveStaticFile(urlPathname) {
  const safePath = decodeURIComponent(urlPathname.split("?")[0]).replace(/^\/+/, "");
  const candidatePath = path.join(distDir, safePath);

  try {
    const candidateStats = await stat(candidatePath);
    if (candidateStats.isDirectory()) {
      return path.join(candidatePath, "index.html");
    }

    return candidatePath;
  } catch {
    // Fall through to SPA fallback.
  }

  if (!safePath || urlPathname.endsWith("/")) {
    return path.join(distDir, safePath, "index.html");
  }

  return path.join(distDir, "index.html");
}

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://127.0.0.1");
      const filePath = await resolveStaticFile(url.pathname);
      const content = await readFile(filePath);

      response.writeHead(200, { "Content-Type": getContentType(filePath) });
      response.end(content);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(4173, "127.0.0.1", () => resolve(undefined));
  });

  return server;
}

async function waitForPrerenderSignal(page) {
  await page.evaluate(
    ({ eventName, timeoutMs, statusKey }) =>
      new Promise((resolve) => {
        const currentStatus = window[statusKey];
        if (currentStatus?.ready) {
          resolve(null);
          return;
        }

        let settled = false;

        const finish = () => {
          if (settled) {
            return;
          }

          settled = true;
          resolve(null);
        };

        document.addEventListener(eventName, finish, { once: true });
        window.setTimeout(finish, timeoutMs);
      }),
    {
      eventName: PRERENDER_EVENT,
      statusKey: PRERENDER_STATUS_KEY,
      timeoutMs: PRERENDER_TIMEOUT_MS,
    }
  );
}

async function writeRouteHtml(route, html) {
  const outputPath =
    route === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, route.replace(/^\/+/, ""), "index.html");

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");
}

const { entries, siteUrl } = await getSeoEntries();
const routes = entries.map((entry) => entry.path);
const server = await startStaticServer();

const browser = await puppeteer.launch({
  args: process.platform === "linux" ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
  ...(executablePath ? { executablePath } : {}),
  headless: true,
});

try {
  for (const route of routes) {
    const page = await browser.newPage();

    try {
      await page.evaluateOnNewDocument((payload) => {
        window.__PRERENDER_INJECTED = payload;
        window.__DUBAI_PRERENDER_STATUS = { ready: false };
        document.addEventListener("dubai:prerender-ready", () => {
          window.__DUBAI_PRERENDER_STATUS = { ready: true };
        });
      }, { prerender: true, siteUrl });
      await page.goto(`http://127.0.0.1:4173${route}`, {
        timeout: 15000,
        waitUntil: "domcontentloaded",
      });
      await waitForPrerenderSignal(page);

      const html = await page.content();
      await writeRouteHtml(route, html);
      console.log(`[prerender] ${route}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(undefined);
    });
  });
}
