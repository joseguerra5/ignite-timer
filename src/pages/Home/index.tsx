import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod"
import { differenceInSeconds } from "date-fns"
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput
} from "./styles";
import { useEffect, useState } from "react";

//Schema porque usa Schema based
//precisa criar um objeto com o zod.object e com as keys do form submit e colocar o schema de validação e em seguida a mensagem
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod.number().min(5).max(60),
})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

//infere os tipos diretamente com o zod, não sendo necessario criar o interface
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
}
export function Home() {

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  //armazena o tantos de segundos que ja se passaram
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  //formState recupera o erro informado no schemaform com o formState.error
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0
    }
  })

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    //sempre que uma alteração de estado depender dop estado anterior precisa colocar em uma arrow function
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)

    //reseta os segundos que se passaram a 0 e evita bugs
    setAmountSecondsPassed(0)

    //precisa preencher o defaultValues para funcionar o reset
    reset()
  }

  //verifica se o ciclo ativo é igual ao ciclo que já está criado
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  //guarda na contante o valor total do ciclo ativo em segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  //Verifica se tem ciclo ativo e se tiver pega o total de segundos e subtrai pelos segundos passados guardado no estado
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  //armazena o numero de minutos dentro da variavel que calcula o total de segundos restantes
  const minutesAmount = Math.floor(currentSeconds / 60)

  //armazena a quantidade de segundos restantes.
  const secondsAmount = currentSeconds % 60

  //converte a função minutesAmount em string para usar o padStart para a constante sempre ter 2 digitos
  const minutes = String(minutesAmount).padStart(2, "0")
  const seconds = String(secondsAmount).padStart(2, "0")

  console.log(activeCycle)
  const task = watch("task")
  const isSubmitDisabled = !task

  //faz com que o numero comece a descer com a biblioteca date-fns
  useEffect(() => {
    //precisa definir o interval antes para funcionar fora
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))
      }, 1000)
    }

    //função importante para remover os contadores anteriores
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register("task")}
          //controlled components, monitorar a cada transformação
          //onChange={(e) => setTask(e.target.value)}
          //value={task}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
            <option value="Projeto 3"></option>
            <option value="Banana"></option>
          </datalist>
          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            {...register("minutesAmount", { valueAsNumber: true })}
            step={5} min={5} max={60} />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>

          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {
          activeCycle ? (
            <StopCountdownButton type="button" >
              <HandPalm size={24} />Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
              <Play size={24} />Começar
            </StartCountdownButton>
          )
        }

      </form>
    </HomeContainer>
  )
}