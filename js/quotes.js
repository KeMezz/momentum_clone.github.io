const quotes = [
    {
        quote: "무례한 사람의 행위는 내 행실을 바로 잡게 해주는 스승이다.",
        author: "공자",
    },
    {
        quote: "군자가 예절이 없으면 역적이 되고, 소인이 예절이 없으면 도적이 된다.",
        author: "명심보감",
    },
    {
        quote: "쓰러진 자 망할까 두렵지 않고, 낮춘 자 거만할까 두렵지 않다.",
        author: "J. 버넌",
    },
    {
        quote: "예의는 남과 화목함을 으뜸으로 삼는다.",
        author: "논어",
    },
    {
        quote: "겸손한 자만이 다스릴 것이요, 애써 일하는 자만이 가질 것이다.",
        author: "에머슨",
    },
    {
        quote: "아는 것을 안다 하고 모르는 것을 모른다 하는 것이 말의 근본이다.",
        author: "순자",
    },
    {
        quote: "인간은 입이 하나 귀가 둘이 있다. 이는 말하기보다 듣기를 두 배 더하라는 뜻이다.",
        author: "탈무드",
    },
    {
        quote: "입은 화의 문이요, 혀는 이 몸을 베는 칼이다. 입을 닫고 혀를 깊이 간직하면 몸 편안히 간 곳마다 튼튼하다.",
        author: "전당시",
    },
    {
        quote: "악을 피하기 위해 선을 저지름은 선일 수 없다.",
        author: "쉴러 발렌슈타인",
    },
    {
        quote: "시기는 자신의 화살로 자신을 죽인다.",
        author: "그리이스 사화집",
    },
]

const quote = document.querySelector("#quote span:first-child");
const author = document.querySelector("#quote span:last-child");

const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

quote.innerText = todaysQuote.quote;
author.innerText = todaysQuote.author;