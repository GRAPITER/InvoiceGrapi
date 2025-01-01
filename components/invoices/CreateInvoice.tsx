"use client";
import { CalendarRangeIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import SubmitButton from "../login/SubmitButton";
import { useActionState, useState } from "react";

import { createInvoice } from "@/app/utils/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "@/app/utils/schemas";
import { formetCurrency } from "../../app/utils/formetCurrency";

type defaultValue = {
  lastName: string;
  firstName: string;
  email: string;
  address: string;
};

export default function CreateInvoice({
  lastName,
  firstName,
  email,
  address,
}: defaultValue) {
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const totalAmount = (Number(quantity) || 0) * (Number(rate) || 0);
  const [selectDate, setSelectDate] = useState(new Date());
  const [lastResult, actions] = useActionState(createInvoice, undefined);

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: invoiceSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form action={actions} onSubmit={form.onSubmit} id={form.id} noValidate>
      <div>
        <input type="hidden" name={fields.total.name} value={totalAmount} />
        <input
          type="hidden"
          name={fields.date.name}
          value={selectDate.toISOString()}
        />
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-5 w-fit ">
            <Badge variant={"secondary"}>Draft</Badge>
            <Input
              type="text"
              placeholder="Test 123"
              key={fields.invoiceName.key}
              name={fields.invoiceName.name}
              defaultValue={fields.invoiceName.initialValue}
            />
          </div>
          <p className="text-sm text-red-700">{fields.invoiceName.errors}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-6 ">
          <div className="flex flex-col gap-1">
            <Label>Invoice No.</Label>
            <div className="flex ">
              <div className="bg-muted px-3 rounded-l-md border border-r-0 flex items-center">
                #
              </div>
              <div>
                <Input
                  placeholder="9"
                  className="rounded-l-none"
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={fields.invoiceNumber.initialValue}
                />
              </div>
            </div>
            <p className="text-sm text-red-700">
              {fields.invoiceNumber.errors}
            </p>
          </div>
          <div>
            <Label>Currency</Label>
            <div className="flex flex-col gap-1">
              <Select
                defaultValue="USD"
                name={fields.currency.name}
                key={fields.currency.key}
                onValueChange={(e) => setCurrency(e)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    United States Dollar -- USD
                  </SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-700">{fields.currency.errors}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label>From</Label>
            <div className="space-y-2">
              <Input
                placeholder="your Name"
                name={fields.fromName.name}
                key={fields.fromName.key}
                defaultValue={`${firstName} ${lastName}`}
              />
              <p className="text-sm text-red-700">{fields.fromName.errors}</p>

              <Input
                placeholder="your Eamil"
                name={fields.fromEmail.name}
                key={fields.fromEmail.key}
                defaultValue={email}
              />
              <p className="text-sm text-red-700">{fields.fromEmail.errors}</p>
              <Input
                placeholder="your Adress"
                name={fields.fromAddress.name}
                key={fields.fromAddress.key}
                defaultValue={address}
              />
              <p className="text-sm text-red-700">
                {fields.fromAddress.errors}
              </p>
            </div>
          </div>
          <div>
            <Label>To</Label>
            <div className="space-y-2">
              <Input
                placeholder="Clint Name"
                name={fields.clientName.name}
                key={fields.clientName.key}
                defaultValue={fields.clientName.initialValue}
              />
              <p className="text-sm text-red-700">{fields.clientName.errors}</p>
              <Input
                placeholder="Clint Eamil"
                name={fields.clientEmail.name}
                key={fields.clientEmail.key}
                defaultValue={fields.clientEmail.initialValue}
              />
              <p className="text-sm text-red-700">
                {fields.clientEmail.errors}
              </p>
              <Input
                placeholder="Clint Adress"
                name={fields.clientAddress.name}
                key={fields.clientAddress.key}
                defaultValue={fields.clientAddress.initialValue}
              />
              <p className="text-sm text-red-700">
                {fields.clientAddress.errors}
              </p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label>Date</Label>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[280px] flex justify-start text-left font-medium"
                  >
                    <CalendarRangeIcon />{" "}
                    {selectDate ? (
                      <p>{selectDate.toDateString()}</p>
                    ) : (
                      "Pick a Date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={selectDate}
                    onSelect={(date) => setSelectDate(date || new Date())}
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label>Invoice Due</Label>
            <div>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={fields.dueDate.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select due Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-700">{fields.dueDate.errors}</p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-12 gap-4 mb-2 font-medium">
          <p className="col-span-6">Description</p>
          <p className="col-span-2">Quantity</p>
          <p className="col-span-2">Rate</p>
          <p className="col-span-2">Amount</p>
        </div>
        <div className="grid md:grid-cols-12 mb-6 gap-4">
          <div className="col-span-6">
            <Textarea
              placeholder="name and description"
              name={fields.invoiceItemDescription.name}
              key={fields.invoiceItemDescription.key}
              defaultValue={fields.invoiceItemDescription.initialValue}
            />
            <p className="text-sm text-red-700">
              {fields.invoiceItemDescription.errors}
            </p>
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              placeholder="0"
              name={fields.invoiceItemQuantity.name}
              key={fields.invoiceItemQuantity.name}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <p className="text-sm text-red-700">
              {fields.invoiceItemQuantity.errors}
            </p>
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              placeholder="0"
              name={fields.invoiceItemRate.name}
              key={fields.invoiceItemRate.name}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <p className="text-sm text-red-700">
              {fields.invoiceItemRate.errors}
            </p>
          </div>
          <div className="col-span-2">
            <Input
              placeholder="$0.00"
              value={formetCurrency({
                amount: totalAmount,
                currency: currency as any,
              })}
              disabled
            />
          </div>
        </div>
        <div className="flex justify-end mb-6">
          <div className="w-1/3 font-semibold">
            <div className="flex justify-between py-3 border-b-2">
              <span>Subtotal</span>
              <span>
                {formetCurrency({
                  amount: totalAmount,
                  currency: currency as any,
                })}
              </span>
            </div>
            <div className="flex justify-between py-3 ">
              <span>Total ({currency})</span>
              <span className="underline underline-offset-2 font-medium">
                {formetCurrency({
                  amount: totalAmount,
                  currency: currency as any,
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 mb-6">
          <Label>Note</Label>
          <Textarea
            placeholder="add your note right here..."
            name={fields.note.name}
            key={fields.note.key}
            defaultValue={fields.note.initialValue}
          />
          <p className="text-sm text-red-700">{fields.note.errors}</p>
        </div>
        <div className="w-full flex justify-end">
          <SubmitButton text="Send invoice to clint" />
        </div>
      </div>
    </form>
  );
}
