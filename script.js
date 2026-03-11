let flowStack = [];
let state = { tenor: 91, yield: 0.15 };

function openInvestmentMenu() {
    document.getElementById('master-investment-overlay').style.display = 'flex';
    goToStep('step-grid', 'Investments');
}

function goToStep(id, title) {
    document.querySelectorAll('.flow-step').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.getElementById('flow-title').innerText = title;

    const sub = document.getElementById('flow-sub');
    sub.style.display = (id === 'step-grid' || id === 'step-tb-tenors' || id === 'step-tb-review' || id === 'step-tb-success') ? 'block' : 'none';

    flowStack.push({ id, title });
    if (id === 'step-tb-calc') runCalculations();
}

function selectTenor(days, y) {
    state.tenor = days;
    state.yield = y;
    goToStep('step-tb-calc', 'Invest in Treasury Bills');
}

function formatAndCalc(input) {
    let value = input.value.replace(/\D/g, "");
    input.value = value ? Number(value).toLocaleString() : "";
    runCalculations();
}

function runCalculations() {
    const rawValue = document.getElementById('amt-input').value.replace(/,/g, '');
    const face = parseFloat(rawValue) || 0;
    const price = face / (1 + (state.yield * (state.tenor / 365)));
    const net = face - price;
    const matDate = new Date(); matDate.setDate(matDate.getDate() + state.tenor);
    const dateStr = matDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

    const f = n => "₦" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('sum-face').innerText = f(face);
    document.getElementById('sum-net').innerText = "+" + f(net);
    document.getElementById('rev-face').innerText = f(face);
    document.getElementById('rev-price').innerText = f(price);
    document.getElementById('rev-net').innerText = "+" + f(net);
    document.getElementById('rev-date').innerText = dateStr;
}

function handleBack() {
    flowStack.pop();
    if (flowStack.length === 0) {
        document.getElementById('master-investment-overlay').style.display = 'none';
    } else {
        let prev = flowStack.pop();
        goToStep(prev.id, prev.title);
    }
}