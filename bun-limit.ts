import { file } from "bun";

export default {
  port: 3000,
  fetch(request: Request) {
    const pathname = request.url.slice(22);
    return new Response(file(pathname || "index.html"));
  },
};
