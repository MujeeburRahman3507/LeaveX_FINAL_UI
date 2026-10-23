import {

Moon,

Sun

} from "lucide-react";

import {

useTheme

}

from "../../context/ThemeContext";

export default function ThemeSwitcher(){

const{

theme,

setTheme

}=useTheme();

return(

<button

onClick={()=>

setTheme(

theme==="light"

?

"dark"

:

"light"

)

}

className="

w-11

h-11

rounded-full

bg-slate-200

dark:bg-slate-700

flex

items-center

justify-center

transition

"

>

{

theme==="light"

?

<Moon size={20}/>

:

<Sun size={20}/>

}

</button>

);

}