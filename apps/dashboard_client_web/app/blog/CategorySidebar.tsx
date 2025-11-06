import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CategoryTree } from '@/app/blog/CategoryTree.clinet';
import { TTreeNodeWithChildren } from '@/app/blog/blog.types';

// ============================================================================
// CategorySidebar Component
// ============================================================================
interface CategorySidebarProps {
    nodes: TTreeNodeWithChildren[];
    selectedNode: number | null;
    onSelectNode: (id: number, node: TTreeNodeWithChildren) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
    nodes,
    selectedNode,
    onSelectNode,
}) => {
    return (
        <Card className="bg-card border-primary lg:sticky lg:top-4">
            <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-primary flex items-center gap-2 text-sm sm:text-base">
                    <span>&gt;</span> CATEGORIES
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
                <CategoryTree
                    nodes={nodes}
                    selectedNode={selectedNode}
                    onSelectNode={onSelectNode}
                />
            </CardContent>
        </Card>
    );
};
