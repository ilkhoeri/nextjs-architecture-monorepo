import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";

const textTypes = ["text", "emphasis", "strong", "inlineCode"];

function flattenNode(node: any): string {
  const p: string[] = [];
  visit(node, n => {
    if (textTypes.includes(n.type)) {
      p.push(n.value);
    }
  });
  return p.join("");
}

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

export type TableOfContents = {
  items?: Item[];
};

function getItems(node: any, current: Partial<Item>): Partial<Item> {
  if (!node) return {};

  if (node.type === "paragraph") {
    current.title = flattenNode(node);
    visit(node, item => {
      if (item.type === "link") {
        current.url = item.url;
      }
    });
    return current;
  }

  if (node.type === "list") {
    current.items = node.children.map((i: any) => getItems(i, {})).filter(Boolean);
    return current;
  }

  if (node.type === "listItem") {
    const heading = getItems(node.children[0], {});
    if (node.children.length > 1) {
      getItems(node.children[1], heading);
    }
    return heading;
  }

  return {};
}

const getToc = () => (node: any, file: any) => {
  const table = toc(node);
  if (!table.map) return;

  file.data = getItems(table.map, {}) as TableOfContents;
};

export async function getTableOfContents(content: string): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content);
  return result.data as TableOfContents;
}
