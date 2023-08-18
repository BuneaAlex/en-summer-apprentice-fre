import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const fullReloadAlways = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" })
    return []
  },
}

export default {
  plugins: [fullReloadAlways],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
};
