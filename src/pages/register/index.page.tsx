import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Usuário deve ter ao menos 3 letras" })
    .regex(/^([a-z\\-]+)$/i, {
      message: "Usuario deve ter apenas letras e ifens",
    })
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, "O nome precisa ter pelo menos 3 letras."),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (router.query?.username) {
      setValue("username", String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        alert(error.response.data.message);
        return;
      }

      console.log(error);
    }
  };

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem vindo ao Ignite Call!</Heading>

        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>
        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
            {...register("username")}
          />

          {errors.username && <FormError>{errors.username.message}</FormError>}
        </label>

        <label>
          <Text size="sm">Seu nome</Text>
          <TextInput
            placeholder="Seu nome"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
            {...register("name")}
          />
          {errors.name && <FormError>{errors.name.message}</FormError>}
        </label>

        <Button type="submit">
          Próximo passo <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
