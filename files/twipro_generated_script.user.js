// ==UserScript==
// @name twitterを生産的にします
// @namespace http://tampermonkey.net/
// @version 0.1
// @description try to take over the world!
// @author You
// @match https://twitter.com/*
// @match https://x.com/*
// ==/UserScript==
class quizObject {
    statement;
    choices;
    correct_answer_number;
    constructor(statement, choice_list, correct_answer_number) {
        this.statement = statement;
        this.choices = choice_list;
        this.correct_answer_number = correct_answer_number;
    };
    outputQuizHtml() {
        let random_sequence = generateRandomSequence(this.choices.length);
        let choices_html = "";
        for (let i = 0; i < this.choices.length; i++) {
            if (this.correct_answer_number == random_sequence[i]) {
                choices_html = choices_html + `<span class="button019 correct_answer">
                <a>` + this.choices[random_sequence[i]] + `</a>
                </span>`;
            } else {
                choices_html = choices_html + `<span class="button019 wrong_answer">
                <a>` + this.choices[random_sequence[i]] + `</a>
                </span>`;
            }
        }
        let show_answer_html = `
        <div class="button019 show_answer">
            <a>答えを見る</a>
            <div class="answer box1" style="display:none;">
            ` + /*this.choices[this.correct_answer_number]*/ `非表示です` + `
            </div>
        </div>
        `;
        let statement_html = `
        <div class="box1">
        ` + this.statement + `
        </div>
        `;
        return statement_html + choices_html + '<br>' + show_answer_html;
    };
};
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve()
        }, ms)
    })
}
async function cyclicExecute(interval, exec_function) {
    while (1) {
        await sleep(interval);
        exec_function();
    }
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateRandomSequence(length) {
    let sequence = [];
    for (let i = 0; i < length; i++) {
        sequence.push(i);
    }
    let work, index;
    for (let i = 0; i < length; i++) {
        //swap i,random(0,length - 1)
        work = sequence[i];
        index = random(0, length - 1);
        sequence[i] = sequence[index];
        sequence[index] = work;
    }
    return sequence
}
const word_dic = {
    /*'가다': '行く',
    '오다': '来る',
    '보다': '見る',
    '사다': '買う',
    '부르다': '呼ぶ・歌う',
    '타다': '乗る',
    '내리다': '降りる',
    '만나다': '会う',
    '먹다': '食べる',
    '마시다': '飲む',
    '웃다': '笑う',
    '울다': '泣く',
    '놀다': '遊ぶ',*/
    '자다': '寝る',
    '공부하다': '勉強する',
    '전화하다': '電話する',
    '사랑하다': '愛する',
    '좋아하다': '好きだ'
}

function wordQuiz() {
    let result_list = [];
    let statement, choices;
    let index;
    let dic_key_array = [];
    let w;
    for (let i in word_dic) {
        dic_key_array.push(i);
    }
    console.log(dic_key_array);
    for (let key in word_dic) {
        choices = [];
        choices.push(word_dic[key]);
        for (let i = 0; i < 4; i++) {
            index = random(0, dic_key_array.length - 1);
            w = word_dic[dic_key_array[index]];
            while (choices.indexOf(w) != -1) {
                index = random(0, dic_key_array.length - 1);
                w = word_dic[dic_key_array[index]];
            }
            choices.push(w);
        }
        statement = key + "の意味は？";
        let obj = new quizObject(statement, choices, 0);
        result_list.push(obj);
    }
    return result_list;
}

function TwiproData() {
    return wordQuiz();
}


(function () {
    function is_twitter(url_string) {
        if (url_string[8] == 'x') {
            return false;
        }
        return true;
    }
    let style = document.createElement('style');
    style.innerHTML = `
        .button019 a {
    background: #eee;
    border-radius: 3px;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 280px;
    padding: 10px 25px;
    color: #313131;
    transition: 0.3s ease-in-out;
    font-weight: 500;
}
.button019 a:after {
  content: "";
  position: absolute;
  top: 50%;
  bottom: 0;
  right: 2rem;
  font-size: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: right 0.3s;
  width: 6px;
  height: 6px;
  border-top: solid 2px currentColor;
  border-right: solid 2px currentColor;
  transform: translateY(-50%) rotate(45deg);
}
.button019 a:hover {
  background: #6bb6ff;
  color: #FFF;
}
.button019 a:hover:after {
  right: 1.4rem;
}
.box1 {
    padding: 0.5em 1em;
    margin: 2em 0;
    font-weight: bold;
    border: solid 3px #000000;
}
.box1 p {
    margin: 0; 
    padding: 0;
}
`;
    document.head.appendChild(style);
    cyclicExecute(1000, () => {
        if (!is_twitter(location.href)) {
            let url_head = location.href.substring(0, 8);
            let url_tail = location.href.substring(9);
            let url = url_head + "twitter" + url_tail;
            if (url.indexOf('?') == -1) {
                url = url + "?mx=1";
            } else {
                url = url + "&mx=1";
            }
            location.href = url;
        }
    })
    let quiz_position = 3000;
    let set_quiz_time = 20;
    let WA_count = 1;
    let CA_count = 1;
    const quiz_list = TwiproData();
    function f(x){
        if(x < 0.8){
            return -10*Math.log(1-x);
        } else {
            return 998244353;
        }
    }
    cyclicExecute(1000, () => {
        let timeline_rect = document.querySelector('[role="main"]').getBoundingClientRect();
        if (set_quiz_time <= 0) {
            quiz_position = window.scrollY + window.outerHeight + 100;
            let left_margin = document.querySelector('[role="banner"]').getBoundingClientRect().width;
            let quiz_id = "TwiProQuiz-" + quiz_position;
            let test_html = `<div style="position:absolute; top: ` + quiz_position + `px; 
            left: ` + left_margin + `px; 
            z-index: 10000; 
            background-color: #FFFFFF; 
            width: ` + timeline_rect.width + `px; 
            color: #000000;" 
            id="` + quiz_id + `">` + quiz_list[random(0, quiz_list.length - 1)].outputQuizHtml() + `</div>`;
            document.getElementById("react-root").children[0].children[0].children[0].insertAdjacentHTML("afterend", test_html);
            let quiz_element = document.getElementById(quiz_id);
            quiz_element.getElementsByClassName("correct_answer")[0].addEventListener('click', function () {
                quiz_element.style = "display:none;";
                CA_count++;
                if(CA_count + WA_count >= 20){
                    WA_count--;
                }
            });
            let wrong_item_elem = quiz_element.getElementsByClassName("wrong_answer");
            Array.prototype.forEach.call(wrong_item_elem, function (item) {
                item.addEventListener('click', function () {
                    WA_count++;
                    if(CA_count + WA_count >= 20){
                        CA_count--;
                    }
                });
            });
            quiz_element.getElementsByClassName("show_answer")[0].addEventListener('click', function () {
                this.children[1].style = "";
            });
            set_quiz_time += f((CA_count) / (WA_count + CA_count));
        }
        console.log(set_quiz_time);
        set_quiz_time--;
        sleep(27);
        if (document.getElementById("time_display") != null) {
            document.getElementById("time_display").innerHTML = `
            出題までの時間 : `+set_quiz_time+`<br>
            正答率 : `+ ((100*CA_count) / (WA_count + CA_count))+`(%)
            `;
        } else {
            document.getElementById("react-root").children[0].children[0].children[0].insertAdjacentHTML("afterend", `<div id="time_display" style="
                position:fixed;
                bottom: 90px;
                right: 30px;
                z-index: 1000;
            "></div>`);
        }
    })
})();

//bus