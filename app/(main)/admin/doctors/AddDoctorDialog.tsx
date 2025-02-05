"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DoctorFormData, doctorSchema } from "@/app/lib/api/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import api, { APIError } from "@/app/lib/api";
import { useToast } from "@/hooks/use-toast";
import { TOAST_MSGS } from "@/app/constants/constants";
import { useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";

interface AddDoctorDialogProps {
  onClose: () => void;
}

export default function AddDoctorDialog({ onClose }: AddDoctorDialogProps) {
  const { toast } = useToast();

  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "",
    },
  });

  const { mutate, status } = useMutation<
    DoctorFormData,
    APIError,
    DoctorFormData
  >({
    mutationFn: async (data) => api.post("/auth/send-invitation", data),
    onSuccess: () => {
      form.reset();

      toast({
        title: "Success",
        description: TOAST_MSGS.INVITATION_SENT,
        variant: "default",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onFormSubmit = useCallback(
    (data: DoctorFormData) => {
      mutate(data);
    },
    [mutate]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-4 bg-[#018969] hover:bg-[#017857]">
          Add Doctor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Doctors</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new doctor to the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {["email", "firstName", "lastName"].map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof DoctorFormData}
                  render={({ field }) => {
                    const isTouched =
                      form.formState.touchedFields[
                        name as keyof DoctorFormData
                      ];
                    const hasError =
                      form.formState.errors[name as keyof DoctorFormData];

                    return (
                      <FormItem className="relative space-y-0.1">
                        <FormLabel>
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Enter ${name}`}
                            className={`focus:ring-2 focus:ring-[#018969] focus:border-[#018969] focus:outline-none bg-gray-200 transition-all duration-300 ${
                              hasError
                                ? `border-red-500 placeholder-red-500 focus:ring-red-500 ${
                                    isTouched ? "animate-shake" : ""
                                  }`
                                : "focus:ring-[#018969] focus:border-[#018969]"
                            }`}
                            onBlur={() =>
                              form.trigger(name as keyof DoctorFormData)
                            }
                          />
                        </FormControl>
                        <div className="h-0.5">
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => {
                  const isTouched = form.formState.touchedFields.role;
                  const hasError = form.formState.errors.role;
                  return (
                    <FormItem className="relative space-y-0.1">
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          form.setValue("role", value as "doctor" | "patient", {
                            shouldValidate: true,
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="patient">Patient</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="h-0.5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-[#018969] hover:bg-[#017857]"
                disabled={status === "pending"}
              >
                {status === "pending" ? <Spinner /> : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
