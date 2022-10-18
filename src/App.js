import { useRef, useState } from "react";

function App() {
  let offset = new Date().getTimezoneOffset();
  offset = (offset + 180)/60
  const ticket_quantity = 700 // рублей в один путь
  const ticket_compose_quantity = 1200 // рублей в оба пути
  
  let [showAtoB, setShowAtoB] = useState(false);
  let [showBtoA, setShowBtoA] = useState(false);
  let [timeAtoB, setTimeAtoB] = useState(null)
  let [timeBtoA, setTimeBtoA] = useState(null)
  let [showWarningIntersect, setShowWarningIntersect] = useState(false)
  let [showWarningEmpty, setShowWarningEmpty] = useState(false)
  let [price, setPrice] = useState(0)
  const InputPrice = useRef(null)
  let [commonTime, setCommonTime] = useState(0)

  function onChange(event) {
    const value = event.target.value;
    if (value === "Не выбрано") {
      setShowAtoB(false)
      setShowBtoA(false)
      setTimeAtoB(null)
      setTimeBtoA(null)
    }
    if (value === "из A в B") {
      setShowAtoB(true)
      setShowBtoA(false)
      setTimeBtoA(null)
    }
    if (value === "из B в A") {
      setShowAtoB(false)
      setShowBtoA(true)
      setTimeAtoB(null)
    }
    if (value === "из A в B и обратно в А") {
      setShowAtoB(true)
      setShowBtoA(true)
    }
  }

  function calculate() {
    const count_tickets = InputPrice.current.value
    setShowWarningEmpty(false)
    setShowWarningIntersect(false)
    if (count_tickets === "") {
      setShowWarningEmpty(true)
      setPrice(0)
      return
    }
    if (showAtoB && timeAtoB === null) {
      setTimeAtoB("18:00")
      console.log(timeAtoB)
    }
    if (showBtoA && timeBtoA === null) {
      setTimeBtoA("18:30")
      console.log(timeBtoA)
    }
    if (showAtoB && showBtoA) {
      const [hoursAtoB, minutesAtoB] = timeAtoB.split(":")
      const [hoursBtoA, minutesBtoA] = timeBtoA.split(":")
      const date1 = new Date(2000, 0, 1, +hoursAtoB, +minutesAtoB);
      const date2 = new Date(2000, 0, 1, +hoursBtoA, +minutesBtoA);
      if ((date2 - date1)/1000/60 < 50){
        setShowWarningIntersect(true)
        setPrice(0)
        return
      }
      setPrice(+count_tickets*ticket_compose_quantity)
      setCommonTime((date2 - date1)/1000/60 + 50)
    }
    if ((showAtoB && !showBtoA) || (showBtoA && !showAtoB)){
      setPrice(+count_tickets*ticket_quantity)
      setCommonTime(50)
    }
  }

  // прибавляет по 50 минут к времени
  function addTime(time) {
    if (time === null){
      return null
    }
    let [hours, minutes] = time.split(":")
    hours = +hours; minutes = +minutes
    minutes += 50
    if (minutes > 59){
      hours += 1
      minutes -= 60
    }
    return `${hours}:${minutes}`
  }

  // применить часовой пояс
  function applyOffset(time) {
    if (time === null){
      return null
    }
    let [hours, minutes] = time.split(":")
    hours = +hours; minutes = +minutes
    hours -= offset
    if (hours > 23) {
      hours -= 24
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    return `${hours}:${minutes}`
  }

  return (
    <div className="app">
      <br /><br />
      <label htmlFor="route">Выберите направление</label>
      <select name="route" id="route" onChange={onChange}>
        <option value="Не выбрано">Не выбрано</option>
        <option value="из A в B">из A в B</option>
        <option value="из B в A">из B в A</option>
        <option value="из A в B и обратно в А">из A в B и обратно в А</option>
      </select><br /><br />
      {showAtoB && 
      <>
        <label htmlFor="time-from-a-to-b">Выберите время из A в В</label>
        <select name="time-from-a-to-b" id="time-from-a-to-b" onChange={(event) => setTimeAtoB(event.target.value)}>
          <option value="18:00">{18 - offset}:00</option>
          <option value="18:30">{(18 - offset) % 24}:30</option>
          <option value="18:45">{(18 - offset) % 24}:45</option>
          <option value="19:00">{(19 - offset) % 24}:00</option>
          <option value="19:15">{(19 - offset) % 24}:15</option>
          <option value="21:00">{(21 - offset) % 24}:00</option>
        </select><br /><br />
      </>}
      {showBtoA && <>
        <label htmlFor="time-from-b-to-a">Выберите время из B в А</label>
        <select name="time-from-b-to-a" id="time-from-b-to-a" onChange={(event) => setTimeBtoA(event.target.value)}>
          <option value="18:30">{(18 - offset) % 24}:30</option>
          <option value="18:45">{(18 - offset) % 24}:45</option>
          <option value="19:00">{(19 - offset) % 24}:00</option>
          <option value="19:15">{(19 - offset) % 24}:15</option>
          <option value="19:35">{(19 - offset) % 24}:35</option>
          <option value="21:50">{(21 - offset) % 24}:50</option>
          <option value="21:55">{(21 - offset) % 24}:55</option>
        </select><br /><br />
      </>}
      {(showBtoA || showAtoB) && <>
        <label htmlFor="num">Количество билетов</label>
        <input ref={InputPrice} id="num" /><br /><br />
        <button onClick={calculate}>Посчитать</button>
      </>
      }
      <p style={{display: price ? "block" : "none"}}>
      Вы выбрали билетов: {InputPrice.current?.value} по маршруту {showAtoB ? "из А в В" : ""}
      {showBtoA && showAtoB ? " и" : ""} {showBtoA ? "из B в A" : ""} стоимостью {price + "р." || "Не выбрано"}</p>
      <p style={{display: price ? "block" : "none"}}>
        Это путешествие займёт у вас {commonTime} минут.
      </p>
      <p style={{display: price ? "block" : "none"}}>
        Теплоход убывает в {applyOffset(timeAtoB || timeBtoA)}, а прибывает в {applyOffset(addTime(timeBtoA || timeAtoB))}
      </p>
      {showWarningIntersect && <p className="red">Покупка билета невозможна, так как времена пересекаются</p>}
      {showWarningEmpty && <p className="red">Поле "количество билетов" не может быть пустым.</p>}
    </div>
  );
}

export default App;
