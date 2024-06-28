import { marked } from "marked";
import fs from "fs";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const mdFolder = "./articles/markdown";
const outpFolder = "./articles/html";

function convertMd() {
  fs.readdir(mdFolder, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((file) => {
      fs.readFile(`${mdFolder}/${file}`, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }

        const { window } = new JSDOM("<!DOCTYPE html>").window;
        const DOMPurify = createDOMPurify(window);
        const html = DOMPurify.sanitize(marked(data));
        fs.writeFile(
          `${outpFolder}/${file.replace(".md", "")}.html`,
          html,
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      });
    });
  });
}

convertMd();
