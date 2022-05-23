# orbitez

P2E canvas game with NFT pass/skin and DeFi mechanics 

https://orbitez.io

https://orbitez.io/dashboard

## Game Universe

The player will have to take part in the process of forming solar systems. He will fight for survival by controlling a small little planet, which is gradually gaining mass by collecting particles of matter and other small celestial bodies.
The speed in the game is measured not in minutes, but in hundreds of thousands of years. Thus, one match lasts about 100 thousand years.
Time in the game universe runs its course. Inevitably there appears technologically advanced civilizations. Over time, the game will change Epoches. The initial set of planets represents the First Epoch of "natural planets". The Second Epoch of "wandering planets" will contain worlds modified by a technically advanced civilization. On them, you will find Space elevators, planetary engines, Bussard ramjets, etc. The Third Epoch of "artificial planets" will consist of fully artificial cosmic bodies, such as Dyson spheres and Ringworlds. 
## Transactions flow | Mechanics

1) Mint or buy for 1tez unique orbitoid to get into game
2) Each 0.8tez from primary sale -> liquidity pool with ORB token.
3) Other 0.2tez -> DAO contract(TODO)
4) Enter battleground lobby with orbitoid NFT and choose bet type: tez or LP token (orb/tez)
5) 80% goes to TOP 3 players at the time of baking the final block(1 round = 15 blocks in Tezos) battleground bank
6) 15% goes to Crunchy Deep Freezer contract, to increase liquidity (orb/tez)
7) 5% goes to ORB DAO contract
8) TOP 3 players recieve 80 ORB token per round (1st: 40 ORB, 2nd: 25 ORB, 3rd: 15 ORB)
9) Other players who are not in the TOP 3 - recieve 3 ORB token each


![CleanShot 2021-12-18 at 18 42 52](https://user-images.githubusercontent.com/4786779/146650715-1f62c00e-1ae4-489d-86ef-a25f7b6be4bd.png)

## Game Server Deployments
Orbitez allows you to deploy your own game server and optionally a Tezos Node in one click on a cloud Provider of your choice (Currently fully supported are: DigitalOcean. In progress: AWS, GCP, Azure).

Once the server is created you can configure the server parameters and register it in the smart contract of the game - this will allow you to receive 50% of all the fees we collect on every game played.

We leverage Docker hub to securely store images of the orbitez.io game server. 

## Tezos node deployment
Mainnet nodes are often overloaded and/or have high latencies and with many popular projects it gets nearly impossible to mint anything unless you're leveraging your own node.
Our goal is to make deployment of your own Tezos node as simple as possible for the user. Tick a checkbox when deploying a game server with us and we'll bring up your very own Tezos node you can plug & play directly into your Temple wallet. All HTTPS certs are taken care of with use of Ngrok.io.

## Flex points / FAQs
1. How do we prevent forgery of the leaderboard?

We run a custom Oracle on the back end server which communicates with the game server and signs the leaderboard object. Front end only receives signed and packed encoded values of the game state when the game ends - this ensures consistency of data end to end.

2. How do we handle flakiness and slowness of IPFS gateways in global setup?

IPFS gateways have proven to be quite inconsistent and unreliable. Depending on where you are and how loaded gateways are some may perform significantly better than others.
We selected the top 10 IPFS gateway providers and perform a race-test. Whichever gateway provider wins the `Promise.race` gets to serve us our beautiful generative planets inside of the game.


## Planned

- [ ] Animated Orbitoid(planet) in action!
- [ ] Play with your own FA2 NFT as a skin in orbitez game (hold 100 ORB token to unlock this feature)
- [ ] ORB token farming (incentivize farmers to bet in LP as good as players to farm with ORB rewards)
- [ ] Agar(orbitez) proof of leaderboard (Merkle tree -> own tzstamp server). 
- [ ] Each block send tx with merkle tree of all player key events in the game
- [ ] Federative servers(matrix protocol or simmilar), incentive for local node runners(by played games on this server count)
- [ ] Each node check all another 


![CleanShot 2021-12-18 at 18 21 09](https://user-images.githubusercontent.com/4786779/146650093-aa8692e7-b332-4689-ad58-7b9d8e788214.png)

## Gameplay

Fight with players from all over the world as you try to become the largest Planet in a solar system! Control your tiny planet and eat other players to grow larger. Mint your own, unique generative planet as NFT to enter the battlefield!


Presentation: https://docs.google.com/presentation/d/1pYjczLbxw6lLJv-t_jSi37i-G3O2qyT-tT-gAGt_x-0/edit

