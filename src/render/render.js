import { render } from 'react-dom';
import router from './router';


/**
 * Minecraft Chat App
 * @copyright Alejandro Cavazos (C) 2016
 */

 const node = document.querySelector('#app');
 render(router, node);
