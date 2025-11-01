import React from 'react';

/**
 * The individual TOC item shape, which should be available globally
 * from `types/global.d.ts`.
 *
 * type TTocItem = {
 *   depth: number;
 *   text: string;
 *   slug: string;
 * };
 */

interface TableOfContentsProps {
    tocItems: TTocItem[];
}

/**
 * A component that renders a table of contents from a flat list of items,
 * applying indentation based on the item's depth using Tailwind CSS.
 */
export const TableOfContents: React.FC<TableOfContentsProps> = ({
    tocItems,
}) => {
    // A lookup object to map heading depth to a Tailwind CSS margin-left class.
    // This provides a clear, customizable, and performant way to handle indentation.
    const indentationClasses: { [key: number]: string } = {
        1: 'ml-0', // No indent for h1
        2: 'ml-4', // 1rem indent for h2
        3: 'ml-8', // 2rem indent for h3
        4: 'ml-12', // 3rem indent for h4
        5: 'ml-16', // 4rem indent for h5
        6: 'ml-20', // 5rem indent for h6
    };

    // Return null or a placeholder if there are no items to display.
    if (!tocItems || tocItems.length === 0) {
        return null;
    }

    return (
        <aside className="w-full">
            <h2 className="mb-2 text-lg font-semibold">On this page</h2>
            <nav>
                <ul className="space-y-2">
                    {tocItems.map((item) => (
                        <li
                            key={item.slug}
                            // Look up the appropriate class based on the item's depth,
                            // defaulting to no indent if depth is not in the map.
                            className={indentationClasses[item.depth] || 'ml-0'}
                        >
                            <a
                                href={`#${item.slug}`}
                                className="text-sm text-muted-foreground hover:text-primary hover:underline"
                            >
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default TableOfContents;
