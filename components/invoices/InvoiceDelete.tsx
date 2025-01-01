import { CheckCircle2, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";

type tasks = {
  id: string;
  task: string;
  description: string;
  action: (formData: FormData) => Promise<void>;
};

export default function InvoiceDelete({
  id,
  task,
  description,
  action,
}: tasks) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="p-2">
          <Button
            className="flex h-5 bg-transparent font-normal hover:rounded-md border-0 py-4 px-2 w-full justify-start"
            variant={"ghost"}
          >
            {task === "Delete" ? <Trash /> : <CheckCircle2 />}
            {task}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-medium text-center py-4">
              {description}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full flex justify-around">
            <form action={action}>
              <input type="hidden" value={id} name="id" />
              <Button
                variant={"default"}
                size={"lg"}
                className="bg-red-700 hover:bg-red-800"
              >
                {task}
              </Button>
            </form>
            <div>
              <DialogClose asChild>
                <Button variant={"default"} size={"lg"} type="submit">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
