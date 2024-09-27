import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles.ts";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "..";


export function CountDown() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed } = useContext(CyclesContext)
 
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

    //atualiza o title com o tempo rodando
    useEffect(() => {
      if (activeCycle) {
        document.title = `${minutes}:${seconds}`
      }
    }, [minutes, seconds, activeCycle])

  //faz com que o numero comece a descer com a biblioteca date-fns
  useEffect(() => {
    //precisa definir o interval antes para funcionar fora
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)
        //se o total de segundos percorrido for maior ou igual a diferença de segundos então a tarefa terminou, se não, grava o segundos interrompidos
        if (secondsDifference >= totalSeconds) {
          //substitui a função de baixo
          markCurrentCycleAsFinished()
          //setCycles((state) => state.map(cycle => {
            //se o ciclo do id for igual o ciclo ativo, então vai retornar todos os dados do ciclo e depois adiciona o interruptedDate com a data atual
           // if (cycle.id === activeCycleId) {
           //   return { ...cycle, finishedDate: new Date() }
              //se não retorna o cycle sem adicionar informação
           // } else {
           //   return cycle
         //   }
        //  }),
       //   )
          //faz isso para zerar na tela
          setSecondsPassed(totalSeconds)
          //tem que dar um clearinterval no interval para parar de rodar em tela
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
    //função importante para remover os contadores anteriores
  }, [activeCycle, totalSeconds, activeCycleId, setSecondsPassed])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>

  )
}