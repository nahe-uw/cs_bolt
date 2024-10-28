"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableStructure } from "@/hooks/use-table-structure";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Trash2 } from "lucide-react";

export function TableStructureView() {
  const { tables, isLoading, error, fetchTables, deleteTables } = useTableStructure();
  const { toast } = useToast();
  const [selectedTables, setSelectedTables] = useState<Set<number>>(new Set());

  const handleRefresh = async () => {
    try {
      await fetchTables();
      toast({
        title: "更新完了",
        description: "テーブル構造を更新しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      // 選択されたテーブルを削除
      const success = await deleteTables(Array.from(selectedTables));
      if (success) {
        toast({
          title: "削除完了",
          description: "選択したテーブル情報を削除しました",
        });
        setSelectedTables(new Set()); // 選択をクリア
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedTables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // エラー表示をUIの一部として表示
  const renderContent = () => {
    if (tables.length > 0) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>テーブル名</TableHead>
              <TableHead>API URL</TableHead>
              <TableHead>選択</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell>{table.tableName}</TableCell>
                <TableCell className="text-muted-foreground text-sm truncate max-w-md">
                  {table.apiUrl ? table.apiUrl : 'API URLが設定されていません'} 
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedTables.has(table.id)}
                    onChange={() => toggleSelection(table.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    
    return (
      <div className="text-center text-muted-foreground py-8">
        {isLoading ? "読み込み中..." : (
          error ? error : "テーブル情報がありません。更新ボタンをクリックしてください。"
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">テーブル一覧</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading || selectedTables.size === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            削除
          </Button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
