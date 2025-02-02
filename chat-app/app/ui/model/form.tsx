import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startTransition, useActionState, useState } from "react";
import { ComfirmVectorStore } from "@/server_components/RAG/vectore_store";
import { getFileBase64 } from "@/lib/utils";

export function CreateForm() {
  const [state, formAction, isPending] = useActionState(ComfirmVectorStore, {
    sucuess: false,
  });
  const [file, setFile] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  return (
    <Dialog
      onOpenChange={() => {
        startTransition(() => {
          formAction(undefined);
          setFile("");
        });
      }}
    >
      <DialogTrigger asChild>
        <Button size="icon">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>モデル作成</DialogTitle>
          <DialogDescription>
            ドキュメントを使用するモデルを作成します
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                モデル名
              </Label>
              <Input name="name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                説明
              </Label>
              <Input name="description" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                ドキュメント
              </Label>
              <Input
                className="col-span-3"
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileLoading(true);
                    const text = await getFileBase64(file);
                    console.log(text);
                    setFile(text);
                    setFileLoading(false);
                  }
                }}
              />
              <Input
                name="file"
                className="hidden"
                value={file}
                onChange={() => {}}
              />
            </div>
          </div>
          <DialogFooter className="items-center">
            {state.sucuess ? <Check></Check> : state.error_message}
            <Button type="submit" disabled={isPending || fileLoading}>
              {isPending ? (
                <>
                  <Loader2 className="animate-spin"></Loader2>作成中
                </>
              ) : (
                "作成"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
