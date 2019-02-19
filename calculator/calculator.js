import 'animate.css'
import './calculator.css'
import './components/calculator';

App.root('#app').create({
    div: {
        calculator: {}
    }
}).setState({
    calculator: {
        result: '',
        statement: ''
    }
});