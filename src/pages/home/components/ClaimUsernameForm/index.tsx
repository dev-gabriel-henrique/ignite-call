import { Button, Text, TextInput } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { Form, FormAnnotation } from "./styles";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Usuário deve ter ao menos 3 letras" })
    .regex(/^([a-z\\-]+)$/i, {
      message: "Usuario deve ter apenas letras e ifens",
    })
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  const router = useRouter();

  const handleClaimUsername = async (data: ClaimUsernameFormData) => {
    const { username } = data;

    await router.push(`/register?username=${username}`);
  };

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register("username")}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          crossOrigin={undefined}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar <ArrowRight />{" "}
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : "Digite o nome do usuário desejado"}
        </Text>
      </FormAnnotation>
    </>
  );
}
