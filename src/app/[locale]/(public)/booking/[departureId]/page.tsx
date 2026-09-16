"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/providers/auth-provider";
import { useDepartureById } from "@/hooks/use-booking";
import { useAddOns } from "@/hooks/use-add-ons";
import { useHoldBooking } from "@/hooks/use-booking";
import { formatCurrency, formatDate, bi } from "@/lib/format";
import { ApiClientError } from "@/lib/api-client";
import { Link } from "@/i18n/navigation";

const paxSchema = z.object({
  fullName: z.string().min(1, "Bắt buộc"),
  dob: z.string().min(1, "Bắt buộc"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  paxType: z.enum(["ADULT", "CHILD", "INFANT"]),
  occupiesSeat: z.boolean(),
  nationality: z.string().min(1, "Bắt buộc"),
  passportNo: z.string().optional(),
  dietary: z.string().optional(),
});

const schema = z.object({
  fullName: z.string().min(1, "Bắt buộc"),
  phone: z.string().min(8, "Số điện thoại là bắt buộc"),
  email: z.string().email().optional().or(z.literal("")),
  pax: z.array(paxSchema).min(1, "Cần ít nhất 1 hành khách"),
  addOnIds: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

const STEPS = ["contact", "addOns", "confirm"] as const;

export default function BookingFlowPage() {
  const params = useParams<{ departureId: string; locale: string }>();
  const departureId = params.departureId as string;
  const locale = (params.locale as string) ?? "vi";
  const t = useTranslations("booking");
  const { status } = useAuth();
  const { data: departure } = useDepartureById(departureId);
  const { data: addOns } = useAddOns(departure?.tourId, departureId);
  const holdBooking = useHoldBooking();

  const [step, setStep] = React.useState<number>(0);
  const [result, setResult] = React.useState<{ code: string; holdExpiresAt: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      pax: [
        {
          fullName: "",
          dob: "",
          gender: "MALE",
          paxType: "ADULT",
          occupiesSeat: true,
          nationality: "VN",
        },
      ],
      addOnIds: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "pax" });

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="mb-4">Vui lòng đăng nhập hoặc đăng ký để giữ chỗ.</p>
        <div className="flex gap-2 justify-center">
          <Button render={<Link href={`/login?next=/booking/${departureId}`} />}>
            Đăng nhập
          </Button>
          <Button variant="outline" render={<Link href={`/register?next=/booking/${departureId}`} />}>
            Đăng ký
          </Button>
        </div>
      </div>
    );
  }

  async function onSubmitFinal(values: FormValues) {
    try {
      const selectedAddOns = (addOns ?? []).filter((a) => values.addOnIds.includes(a.id));
      const booking = await holdBooking.mutateAsync({
        departureId,
        contact: { fullName: values.fullName, phone: values.phone, email: values.email || undefined },
        pax: values.pax.map((p) => ({
          fullName: p.fullName,
          dob: p.dob,
          gender: p.gender,
          paxType: p.paxType,
          occupiesSeat: p.occupiesSeat,
          nationality: p.nationality,
          passportNo: p.passportNo || undefined,
          dietary: p.dietary || undefined,
        })),
        addOns: selectedAddOns.map((a) => ({ addOnId: a.id, quantity: 1 })),
      });
      setResult({ code: booking.code, holdExpiresAt: booking.holdExpiresAt ?? "" });
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Giữ chỗ thất bại");
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-teal-700">{t("holdSuccessTitle")}</h1>
        <p className="mt-3 text-muted-foreground">
          {t("holdSuccessBody", {
            code: result.code,
            expiry: result.holdExpiresAt ? formatDate(result.holdExpiresAt, locale) : "",
          })}
        </p>
        <Button className="mt-6" render={<Link href="/my-bookings" />}>
          Xem đơn của tôi
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {departure && (
        <Card className="mb-6">
          <CardContent className="py-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{formatDate(departure.departDate, locale)}</p>
              <p className="text-sm text-muted-foreground">Mã đoàn: {departure.code}</p>
            </div>
            <p className="font-semibold text-teal-700">
              {formatCurrency(departure.priceAdult, departure.currency)} / khách
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 mb-6 text-sm">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`flex-1 text-center py-2 rounded-md border ${
              i === step ? "bg-teal-600 text-white" : "bg-muted"
            }`}
          >
            {t(`steps.${s}`)}
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmitFinal)}>
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("contactInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{t("fullName")}</label>
                  <Input {...form.register("fullName")} />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">{t("phone")}</label>
                  <Input {...form.register("phone")} />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">{t("email")}</label>
                <Input {...form.register("email")} />
              </div>

              <Separator />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("paxList")}</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      fullName: "",
                      dob: "",
                      gender: "MALE",
                      paxType: "ADULT",
                      occupiesSeat: true,
                      nationality: "VN",
                    })
                  }
                >
                  {t("addPax")}
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-md p-3 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      placeholder={t("fullName")}
                      {...form.register(`pax.${index}.fullName` as const)}
                    />
                    <Input type="date" {...form.register(`pax.${index}.dob` as const)} />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Select
                      value={form.watch(`pax.${index}.paxType`)}
                      onValueChange={(v) => {
                        form.setValue(`pax.${index}.paxType`, v as "ADULT" | "CHILD" | "INFANT");
                        // per muc 05/06: infants under 2 typically do not occupy a seat
                        if (v === "INFANT") form.setValue(`pax.${index}.occupiesSeat`, false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("paxType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADULT">Người lớn</SelectItem>
                        <SelectItem value="CHILD">Trẻ em</SelectItem>
                        <SelectItem value="INFANT">Em bé (dưới 2 tuổi)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={t("nationality")}
                      {...form.register(`pax.${index}.nationality` as const)}
                    />
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={form.watch(`pax.${index}.occupiesSeat`)}
                        onCheckedChange={(v) =>
                          form.setValue(`pax.${index}.occupiesSeat`, Boolean(v))
                        }
                      />
                      <span className="text-sm">{t("occupiesSeat")}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Input
                      placeholder={t("passportNo")}
                      {...form.register(`pax.${index}.passportNo` as const)}
                      className="max-w-xs"
                    />
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                        {t("removePax")}
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button type="button" className="w-full" onClick={() => setStep(1)}>
                {t("next")}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("selectAddOns")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(addOns ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">{t("noAddOns")}</p>
              )}
              {(addOns ?? []).map((addOn) => {
                const checked = form.watch("addOnIds").includes(addOn.id);
                return (
                  <label
                    key={addOn.id}
                    className="flex items-center justify-between border rounded-md p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          const current = form.getValues("addOnIds");
                          form.setValue(
                            "addOnIds",
                            v ? [...current, addOn.id] : current.filter((id) => id !== addOn.id)
                          );
                        }}
                      />
                      <div>
                        <p className="font-medium">{bi(addOn.name, locale)}</p>
                        <p className="text-xs text-muted-foreground">{bi(addOn.description, locale)}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-teal-700 text-sm">
                      {formatCurrency(addOn.price, addOn.currency)}
                    </span>
                  </label>
                );
              })}
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(0)}>
                  {t("back")}
                </Button>
                <Button type="button" className="flex-1" onClick={() => setStep(2)}>
                  {t("next")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("confirmHold")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800">
                {t("holdWarning")}
              </p>
              <ul className="text-sm space-y-1">
                <li>
                  {t("fullName")}: <b>{form.watch("fullName")}</b>
                </li>
                <li>
                  {t("phone")}: <b>{form.watch("phone")}</b>
                </li>
                <li>Số hành khách: <b>{form.watch("pax").length}</b></li>
                <li>Dịch vụ cộng thêm: <b>{form.watch("addOnIds").length}</b></li>
              </ul>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  {t("back")}
                </Button>
                <Button type="submit" className="flex-1" disabled={holdBooking.isPending}>
                  {t("submitHold")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
