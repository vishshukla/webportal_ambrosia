import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery';


//paste this code under the head tag or in a separate js file.
// Wait for window load
$(window).on('load', function () {
    setTimeout(() => {
        $(".se-pre-con").fadeIn("fast");
        $(".se-pre-con").fadeOut("slow");
    }, 600);
    // $(".se-pre-con").fadeOut("slow");
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
