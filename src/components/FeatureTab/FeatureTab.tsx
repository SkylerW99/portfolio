import {useState} from "react";
//import placeholderData from "../../json/placeholder.json"

type tabItem = {
    name: string
    image: string
}

type data = tabItem[];

export function FeatureTab( {Data} : {Data: data} ){

    const [activeItem, setActiveItem] = useState(Data[0]);

    function handleClick(ClickedItem: tabItem){
        setActiveItem(ClickedItem);
    }

    return (
    <div>
    {Data.map((item: tabItem) => {
        return <button className="btn" onClick={()=>handleClick(item)} aria-pressed={item.name === activeItem.name}>{item.name} </button>
    })}
    <img src = {activeItem.image}/>
    </div> 
    );
}