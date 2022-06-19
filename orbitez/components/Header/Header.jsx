import Link from 'next/link';
import Image from 'next/image';
import { useTezos } from '../../hooks/useTezos';

export default function Header() {
    const { connectWallet, disconnectWallet, address, balance } = useTezos()

    return (
        <header className="header container">
            <div className="header__linkBlock">
                <Image 
                    className="header__icon" 
                    src="/img/icon-leaderboard.png" 
                    layout="fixed" 
                    width={21} 
                    height={31}
                    alt=""
                />
                <Link href={'/leaderboard'}>
                    <a className="header__link">
                        LeaderBoard
                    </a>
                </Link>
            </div>

            <div className="header__money money">
                <div className="money__item">
                    <p className="money__name">TEZ</p>
                    <p className="money__num">{address != '' ? balance.toFixed(2) : '0'}</p>
                </div>
                <div className="money__item">
                    <div className="money__name">LP</div>
                    <div className="money__num">0</div>
                </div>
            </div>

            <div className="header__linkBlock">
                <Image 
                    className="header__icon" 
                    src="/img/icon-log-out.png" 
                    layout="fixed" 
                    width={43} 
                    height={34}
                    alt=""
                />
                <a className="header__link" onClick={() => address == '' ? connectWallet() : disconnectWallet()}>
                    {address == '' ? 'Connect wallet' : 'Log out'}
                </a>
            </div>
        </header>
    )
}

