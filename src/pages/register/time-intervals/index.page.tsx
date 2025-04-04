import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import { Container, Header } from "../styles";
import {
  FormError,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from "./styles";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { getWeekDays } from "@/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { api } from "@/lib/axios";

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "Você precisa selecionar pelo menos um dia da semana!",
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        };
      });
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        );
      },
      {
        message:
          "O horário de término deve ser pelo menos 1h distante do horário de início!",
      }
    ),
});

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>;

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver<any>(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ],
    },
  });

  const { fields } = useFieldArray({
    name: "intervals",
    control,
  });

  const weekDays = getWeekDays();

  const intervals = watch("intervals");

  const handleSetTimeInterval = async (data: any) => {
    const { intervals } = data as TimeIntervalsFormOutput;
    
    await api.post('/users/time-intervals', {
      intervals
    })
  };

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>

        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeInterval)}>
        <IntervalsContainer>
          {fields.map((field, index) => (
            <IntervalItem key={field.id}>
              <IntervalDay>
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true);
                        }}
                      />
                    );
                  }}
                />
                <Text>{weekDays[field.weekDay]}</Text>
              </IntervalDay>

              <IntervalInputs>
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={intervals[index].enabled === false}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                  {...register(`intervals.${index}.startTime`)}
                />
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={intervals[index].enabled === false}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                  {...register(`intervals.${index}.endTime`)}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </IntervalsContainer>

        {errors.intervals && (
          <FormError size="sm">{errors.intervals.root?.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Próximo Passo <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  );
}
