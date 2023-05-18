import { createApp } from '../src/index';
import 'animate.css'
import './calculator.css'
import { Calculator } from './components/calculator';

createApp({
    '#app': {
        Calculator
    }
});