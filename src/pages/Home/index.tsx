import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod" 

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { createContext, useState } from "react";
import { NewCycleForm } from "./NewCycleForm/index.tsx";
import { CountDown } from "./CountDown/index.tsx";



// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }


interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishedDate?: Date;
}

//coloca as propriedades aqui para funcionar com o contexto
interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}


//contexto para os componentes acessarem as propriedades dessa home
export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {

   //armazena o tantos de segundos que ja se passaram
   const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  //verifica se o ciclo ativo é igual ao ciclo que já está criado
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  

  //Schema porque usa Schema based
  //precisa criar um objeto com o zod.object e com as keys do form submit e colocar o schema de validação e em seguida a mensagem
  const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(5).max(60),
  })

  //formState recupera o erro informado no schemaform com o formState.error
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
    }
  })

  const { handleSubmit, watch, reset } = newCycleForm

 
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }
  


  //infere os tipos diretamente com o zod, não sendo necessario criar o interface
  type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>



  function markCurrentCycleAsFinished() {
    setCycles((state) => state.map(cycle => {
      //se o ciclo do id for igual o ciclo ativo, então vai retornar todos os dados do ciclo e depois adiciona o interruptedDate com a data atual
      if (cycle.id === activeCycleId) {
        return { ...cycle, finishedDate: new Date() }
        //se não retorna o cycle sem adicionar informação
      } else {
        return cycle
      }
    }),
    )
  }
  const task = watch("task")
  const isSubmitDisabled = !task

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

  function handleInterruptCycle() {
    //fazer o ciclo ativo voltar para nulo, para não reproduzir em tela
    setActiveCycleId(null)
    //anotar se o ciclo foi interrompido ou não
    setCycles((state) => state.map(cycle => {
      //se o ciclo do id for igual o ciclo ativo, então vai retornar todos os dados do ciclo e depois adiciona o interruptedDate com a data atual
      if (cycle.id === activeCycleId) {
        return { ...cycle, interruptedDate: new Date() }
        //se não retorna o cycle sem adicionar informação
      } else {
        return cycle
      }
    }))
  }



  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">

        <CyclesContext.Provider 
          value={{ 
            activeCycle, 
            activeCycleId, 
            markCurrentCycleAsFinished,
            amountSecondsPassed, 
            setSecondsPassed 
            }}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
        </CyclesContext.Provider>
        {
          activeCycle ? (
            <StopCountdownButton onClick={handleInterruptCycle} type="button" >
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