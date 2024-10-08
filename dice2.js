let lastRolls = [];
let lastResultAmount = 0;

document.getElementById('roll-dice').addEventListener('click', rollDice);
document.getElementById('roll-slider').addEventListener('input', updateWinChanceAndPayout);

function updateWinChanceAndPayout() {
    const rollUnder = parseInt(document.getElementById('roll-slider').value);
    const betAmount = parseFloat(document.getElementById('bet-amount').value);

    document.getElementById('win-chance').textContent = `${rollUnder}%`;

    const payoutMultiplier = (100 / rollUnder).toFixed(2);
    document.getElementById('payout-multiplier').textContent = `${payoutMultiplier}x`;

    const estimatedPayout = (payoutMultiplier * betAmount).toFixed(2);
    document.getElementById('estimated-payout').textContent = estimatedPayout;

    updateSliderTrack(rollUnder);
}
if (!localStorage.getItem('balance')) {
    localStorage.setItem('balance', '10000');
}

let balance = parseFloat(localStorage.getItem('balance'));
document.getElementById('balance').textContent = balance.toFixed(2);

function updateBalance(newBalance) {
    balance = newBalance;
    localStorage.setItem('balance', balance.toFixed(2));
    document.getElementById('balance').textContent = balance.toFixed(2);
}

function rollDice() {
    const betAmount = parseFloat(document.getElementById('bet-amount').value);
    const rollUnder = parseInt(document.getElementById('roll-slider').value);
    
    if (betAmount > balance) {
        const modal = document.getElementById('myModal');
        modal.style.display = 'block';

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
        const closeModalButton = document.getElementsByClassName('close')[0];
        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.style.display = 'none';
            }
        });
        return;
    }

    const diceRoll = Math.floor(Math.random() * 100) + 1;
    const diceResultElement = document.getElementById('dice-number');
    diceResultElement.textContent = diceRoll;

    let payout = 0;
    if (diceRoll < rollUnder) {
        payout = (100 / rollUnder) * betAmount;
        balance += payout-betAmount;
        updateLastRoll(diceRoll, true);
        lastResultAmount = payout;
    } else {
        balance -= betAmount;
        updateLastRoll(diceRoll, false);
        lastResultAmount = -betAmount;
    }

    updateBalance(balance);

    document.getElementById('last-result-amount').textContent = `${lastResultAmount > 0 ? "+" : ""}${lastResultAmount.toFixed(2)}`;

    moveDiceRoll(diceRoll);
}

function moveDiceRoll(diceRoll) {
    const diceResultElement = document.getElementById('dice-number');
    const slider = document.getElementById('roll-slider');
    
    const sliderWidth = slider.offsetWidth;
    
    const positionPercentage = diceRoll / 100;
    
    let leftPosition = positionPercentage * sliderWidth;
    
    if (leftPosition < 0) {
        leftPosition = 0;
    } else if (leftPosition > sliderWidth - diceResultElement.offsetWidth) {
        leftPosition = sliderWidth - diceResultElement.offsetWidth;
    }

    diceResultElement.style.left = `${leftPosition}px`;
}

function updateSliderTrack(rollUnder) {
    const winTrack = document.getElementById('win-track');
    winTrack.style.background = `linear-gradient(to right, green ${rollUnder}%, red ${rollUnder}%)`;
}

function updateLastRoll(roll, isWin) {
    if (lastRolls.length >= 5) {
        lastRolls.shift();
    }

    lastRolls.push({ roll, isWin });

    const lastRollsList = document.getElementById('last-rolls-list');
    lastRollsList.innerHTML = '';
    
    lastRolls.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.roll;
        li.className = item.isWin ? 'win' : 'loss';
        lastRollsList.appendChild(li);
    });
}
