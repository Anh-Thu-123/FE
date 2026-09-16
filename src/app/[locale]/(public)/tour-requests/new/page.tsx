"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, ApiClientError } from "@/lib/api-client";

const schema = z.object({
  fullName: z.string().min(1, "Bắt buộc"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  email: z.string().email().optional().or(z.literal("")),
  direction: z.enum(["OUTBOUND", "INBOUND", "DOMESTIC"]),
  destinations: z.string().optional(),
  desiredFrom: z.string().optional(),
  desiredTo: z.string().optional(),
  flexibleDays: z.coerce.number().min(0),
  paxAdult: z.coerce.number().min(1),
  paxChild: z.coerce.number().min(0),
  budgetPerPax: z.coerce.number().optional(),
  interests: z.string().optional(),
  // honeypot field per muc 06 anti-spam guidance - must stay empty
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewTourRequestPage() {
  const t = useTranslations("tourRequest");
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      direction: "OUTBOUND",
      destinations: "",
      flexibleDays: 0,
      paxAdult: 1,
      paxChild: 0,
      interests: "",
      website: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await api.post(
        "/api/public/tour-requests",
        {
          contact: { fullName: values.fullName, phone: values.phone, email: values.email || undefined },
          direction: values.direction,
          destinations: values.destinations ? values.destinations.split(",").map((s) => s.trim()) : [],
          desiredFrom: values.desiredFrom || undefined,
          desiredTo: values.desiredTo || undefined,
          flexibleDays: values.flexibleDays,
          paxAdult: values.paxAdult,
          paxChild: values.paxChild,
          budgetPerPax: values.budgetPerPax,
          interests: values.interests ? values.interests.split(",").map((s) => s.trim()) : [],
        },
        { skipAuth: true }
      );
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-teal-700">{t("successTitle")}</h1>
        <p className="mt-3 text-muted-foreground">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* honeypot - hidden from real users via CSS, bots tend to fill every field */}
              <div className="hidden" aria-hidden="true">
                <Input tabIndex={-1} autoComplete="off" {...form.register("website")} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("direction")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="OUTBOUND">Outbound</SelectItem>
                        <SelectItem value="INBOUND">Inbound</SelectItem>
                        <SelectItem value="DOMESTIC">Domestic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destinations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("destinations")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Kyoto, Osaka, ..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="desiredFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("desiredFrom")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desiredTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("desiredTo")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flexibleDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("flexibleDays")}</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="paxAdult"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("paxAdult")}</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paxChild"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("paxChild")}</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budgetPerPax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("budgetPerPax")}</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("interests")}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {t("submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
