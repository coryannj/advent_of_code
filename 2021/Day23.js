const fs = require('fs');
const input = fs.readFileSync('../day23input.txt',{ encoding: 'utf8', flag: 'r' });
const lines = input.split(/[\r\n]+/).map((x)=>x.trim())

let roomCol = lines[2].slice(1,-1).split('').map((x,ix)=> x === '#' ? x : ix).filter((x)=> x !== '#')
let hallwayMap = lines[1].slice(1,-1).split('')
let roomToHallway = {
    '2': [[1,0],[3,5,7,9,10]],
    '4': [[3,1,0],[5,7,9,10]],
    '6': [[5,3,1,0],[7,9,10]],
    '8': [[7,5,3,1,0],[9,10]]
}
let energy = {'A':1,'B':10,'C':100,'D':1000}
let home = 'ABCD'
let p1RoomLen = 2
let p2RoomLen = 4

// Part 1 setup
let p1roomMap = lines.slice(2,4).map((x)=>x.match(/\w/g))
let p1roomsArr = roomCol.map((x,ix)=>p1roomMap.map((y)=>y[ix]))
let p1state = [0,hallwayMap.slice(),structuredClone(p1roomsArr)]
let p1queue = Array(25000).fill('.').map((x)=>[])
p1queue[0].push(p1state)
let p1currentMin = 1000000
let p1MinStates = {}
let p1DeadEnd = new Set ()

// Part 2 setup
let p2line1 = '#D#C#B#A#'
let p2line2 = '#D#B#A#C#'
let p2roomMap = [lines[2],p2line1,p2line2,lines[3]].map((x)=>x.match(/\w/g))
let p2roomsArr = roomCol.map((x,ix)=>p2roomMap.map((y)=>y[ix]))
let p2state = [0,hallwayMap.slice(),structuredClone(p2roomsArr)]
let p2queue = Array(60000).fill('.').map((x)=>[])
p2queue[0].push(p2state)
let p2currentMin = 1000000
let p2MinStates = {}
let p2DeadEnd = new Set()

function roomToRoom(score,hallway,rooms,roomToRoomIndex,p1orp2){
    let thisRoom = rooms[roomToRoomIndex]
    let valToMove = rooms[roomToRoomIndex][0]
    let homeIndex = home.indexOf(valToMove)
    let currRoom = roomCol[roomToRoomIndex]
    let homeRoom = roomCol[homeIndex]
    let destRoom = rooms[homeIndex]
    let path = currRoom<homeRoom ? hallway.slice(currRoom,homeRoom):hallway.slice(homeRoom,currRoom)
    let roomLen = p1orp2 === 'p1' ? p1RoomLen : p2RoomLen

    if(path.every((z)=>z === '.')){
        //roomToRoom = true
        let toHallSteps = roomLen-thisRoom.length+1
        let hallSteps = path.length
        let roomSteps = roomLen-destRoom.length
        let newScore = score+((toHallSteps+hallSteps+roomSteps)* energy[valToMove])
        let newRooms = rooms.map((r,rx)=>{
            if(rx === roomToRoomIndex){
                return r.slice(1)
            } else if (rx === homeIndex){
                return [valToMove].concat(r)
            } else {
                return r
            }
        })

        return [newScore,hallway,newRooms]

    } else {
        return []
    }
}

function hallwayToRoom(score,hallway,rooms,hallwayToRoomIndex,p1orp2){
    let hallwayVal = hallway[hallwayToRoomIndex]
    let homeIndex = home.indexOf(hallwayVal)
    let homeRoom = roomCol[homeIndex]
    let destRoom = rooms[homeIndex]
    let hallSteps = hallwayToRoomIndex<homeRoom ? homeRoom-hallwayToRoomIndex : hallwayToRoomIndex-homeRoom
    let roomLen = p1orp2 === 'p1' ? p1RoomLen : p2RoomLen
    let roomSteps = roomLen-destRoom.length
    let newScore = score+((hallSteps+roomSteps)*energy[hallwayVal])
    let newRooms = rooms.map((r,rx)=>rx === homeIndex?[hallwayVal].concat(r):r)
    let newHallway = hallway.map((nx,nix)=>nix === hallwayToRoomIndex ? '.':nx)
    
    return [newScore,newHallway,newRooms]
}

function pushToQueue(newScore,newHallway,newRooms,currMin,p1orp2){
    let pkey = [newScore,newHallway,newRooms].slice(1).map((x)=>x.join('')).join('-')
    if(newScore<currMin){
        if(p1orp2 === 'p1'){
            if(!p1DeadEnd.has(pkey)){
                if(p1MinStates[pkey] === undefined || newScore<p1MinStates[pkey]){
                    p1MinStates[pkey] = newScore
                    p1queue[newScore].push([newScore,newHallway,newRooms])
                } 
            }

        } else {
            if(!p2DeadEnd.has(pkey)){
                if(p2MinStates[pkey] === undefined || newScore<p2MinStates[pkey]){
                    p2MinStates[pkey] = newScore
                    p2queue[newScore].push([newScore,newHallway,newRooms])
                } 
            }
        }
    }
}

function getRoomToHallway(score,hallway,rooms,currMin,p1orp2){
    let roomCanMove = rooms.map((vals,ix)=>vals.length>0 && !vals.every((x)=>x ===home[ix])?vals:[])
    let roomLen = p1orp2 === 'p1' ? p1RoomLen : p2RoomLen
    roomCanMove.map((v,vx)=>{
        //console.log('*** NEW ROOM ***')
        //console.log('v , vx ',v,vx)

        if(v.length>0){
            const thisRoomLen = v.length
            const colIndex = roomCol[vx]
            const roomSteps = roomLen-thisRoomLen+1

            let [left,right] = roomToHallway[roomCol[vx]]

            for(i=0;i<left.length;i++){
                let lefthallwayIdx = left[i]
                let lefthallwayVal = hallway[lefthallwayIdx]
                if(lefthallwayVal==='.'){
                    let lefthallSteps = colIndex<lefthallwayIdx? lefthallwayIdx-colIndex : colIndex-lefthallwayIdx
                    let newScore = score+((roomSteps+lefthallSteps)*energy[v[0]])
                    let newHallway = hallway.map((h,hx)=>hx ===lefthallwayIdx? v[0] : h)
                    let newRooms = rooms.map((r,rx)=>rx === vx ? r.slice(1):r)
                    pushToQueue(newScore,newHallway,newRooms,currMin,p1orp2)

                } else {
                    break;
                }
            }

           for(j=0;j<right.length;j++){
            let righthallwayIdx = right[j]
            let righthallwayVal = hallway[righthallwayIdx]
            if(righthallwayVal==='.'){
                let righthallSteps = colIndex<righthallwayIdx? righthallwayIdx-colIndex : colIndex-righthallwayIdx
                let newScore = score+((roomSteps+righthallSteps)*energy[v[0]])
                let newHallway = hallway.map((h,hx)=>hx ===righthallwayIdx? v[0] : h)
                let newRooms = rooms.map((r,rx)=>rx === vx ? r.slice(1):r)
                pushToQueue(newScore,newHallway,newRooms,currMin,p1orp2)

            } else {
                break;
            }
           }
        }
    })
}

// Part 1
while(p1queue.findIndex((x)=>x.length>0) !== -1){
    let [score,hallway,rooms]= p1queue[p1queue.findIndex((x)=>x.length>0)].shift()
    
    if(score>p1currentMin || (p1MinStates[p1state.slice(1).map((x)=>x.join('')).join('-')] !== undefined && p1MinStates[p1state.slice(1).map((x)=>x.join('')).join('-')]<score)){
        continue;
    }
    
    //Room to room
    let roomToRoomIndex = rooms.findIndex((r,rx,roomArr)=> r.length > 0 && home.indexOf(r[0]) !== rx && (roomArr[home.indexOf(r[0])].length === 0 || roomArr[home.indexOf(r[0])].every((z)=>z === r[0])))

    if(roomToRoomIndex !== -1){
        let next = roomToRoom(score,hallway,rooms,roomToRoomIndex,'p1')

        if(next.length>0){
            let [newScore,newHallway,newRooms] = next
            if(newScore<p1currentMin){
                if(newRooms.some((y,yx)=>y.length !== p1RoomLen || y.some((z)=>z !== home[yx]))){
                    pushToQueue(newScore,newHallway,newRooms,p1currentMin,'p1')
                } else {
                    p1currentMin = newScore
                }
            }  
            continue;
        }
    }

    // Hallway to room
    let hallwayToRoomIndex = hallway.findIndex((h,hx,harr)=>{
        if(h === '.'){
            return false
        } else {
            let homeIndex = roomCol[home.indexOf(h)]
            let path = hx<homeIndex ? harr.slice(hx+1,homeIndex+1):harr.slice(homeIndex,hx)
            let homeRoom = rooms[home.indexOf(h)]

            return path.every((p)=>p === '.') && (homeRoom.length === 0 || homeRoom.every((hv)=>hv === h))
        }

    })

    
    if(hallwayToRoomIndex !== -1){
        let [newScore,newHallway,newRooms] = hallwayToRoom(score,hallway,rooms,hallwayToRoomIndex,'p1')
        
        if(newScore<p1currentMin){
            if(newRooms.some((y,yx)=>y.length !== p1RoomLen || y.some((z)=>z !== home[yx]))){
                pushToQueue(newScore,newHallway,newRooms,p1currentMin,'p1')
            } else {
                p1currentMin = newScore
            }
        } 
    
        continue;
    }

    // Room to Hallway
    if (rooms.some((y,yx)=>y.length>0 && y.some((z)=> z !==home[yx]))){
        getRoomToHallway(score,hallway,rooms,p1currentMin,'p1')
        continue;
    }

    p1DeadEnd.add([score,hallway,rooms].slice(1).map((x)=>x.join('')).join('-'))

}

console.log('Part 1 answer is ',p1currentMin)

// Part 2
while(p2queue.findIndex((x)=>x.length>0) !== -1){
    let [score,hallway,rooms]= p2queue[p2queue.findIndex((x)=>x.length>0)].shift()
    
    if(score>p2currentMin || (p2MinStates[p1state.slice(1).map((x)=>x.join('')).join('-')] !== undefined && p2MinStates[p1state.slice(1).map((x)=>x.join('')).join('-')]<score)){
        
        continue;
    }
    
    //Room to room
    let roomToRoomIndex = rooms.findIndex((r,rx,roomArr)=> r.length > 0 && home.indexOf(r[0]) !== rx && (roomArr[home.indexOf(r[0])].length === 0 || roomArr[home.indexOf(r[0])].every((z)=>z === r[0])))

    if(roomToRoomIndex !== -1){
        let next = roomToRoom(score,hallway,rooms,roomToRoomIndex,'p2')

        if(next.length>0){
            let [newScore,newHallway,newRooms] = next
            if(newScore<p2currentMin){
                if(newRooms.some((y,yx)=>y.length !== p2RoomLen || y.some((z)=>z !== home[yx]))){
                    pushToQueue(newScore,newHallway,newRooms,p2currentMin,'p2')
                } else {
                    p2currentMin = newScore
                }
            }  
            continue;
        }
    }

    // Hallway to room
    let hallwayToRoomIndex = hallway.findIndex((h,hx,harr)=>{
        if(h === '.'){
            return false
        } else {
            let homeIndex = roomCol[home.indexOf(h)]
            let path = hx<homeIndex ? harr.slice(hx+1,homeIndex+1):harr.slice(homeIndex,hx)
            let homeRoom = rooms[home.indexOf(h)]

            return path.every((p)=>p === '.') && (homeRoom.length === 0 || homeRoom.every((hv)=>hv === h))
        }

    })
    
    if(hallwayToRoomIndex !== -1){
        let [newScore,newHallway,newRooms] = hallwayToRoom(score,hallway,rooms,hallwayToRoomIndex,'p2')
        
        if(newScore<p2currentMin){
            if(newRooms.some((y,yx)=>y.length !== p2RoomLen || y.some((z)=>z !== home[yx]))){
                pushToQueue(newScore,newHallway,newRooms,p2currentMin,'p2')
            } else {
                p2currentMin = newScore
            }
        } 
    
        continue;
    }

    // Room to Hallway
    if (rooms.some((y,yx)=>y.length>0 && y.some((z)=> z !==home[yx]))){
        getRoomToHallway(score,hallway,rooms,p2currentMin,'p2')
        continue;
    }
    p2DeadEnd.add([score,hallway,rooms].slice(1).map((x)=>x.join('')).join('-'))
}

console.log('Part 2 answer is ',p2currentMin)
