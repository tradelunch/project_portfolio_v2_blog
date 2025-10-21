// import { unified } from 'unified';
// import remarkParse from 'remark-parse';
// import { Root, Heading, Text } from 'mdast';

// interface THeading {
//     level: number;
//     text: string;
//     id: string;
// }

// export async function extractToc(markdown: string): Promise<THeading[]> {
//     const ast: Root = unified().use(remarkParse).parse(markdown) as Root;
//     const headings: THeading[] = [];
  
//     function traverse(node: any): void {
//         if (node.type === 'heading') {
//             const text = node.children
//                 .filter((child: any) => child.type === 'text')
//                 .map((child: Text) => child.value)
//                 .join('');
            
//             headings.push({
//                 level: node.depth,
//                 text,
//                 id: text.toLowerCase().replace(/ /g, '-'),
//             });
//         }
        
//         if (node.children) {
//             node.children.forEach(traverse);
//         }
//     }
  
//     traverse(ast);
//     return headings;
// }

export {}