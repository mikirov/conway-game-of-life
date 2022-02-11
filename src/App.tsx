import React, {useEffect} from 'react';
import './App.css';
import Sketch from "react-p5";
import P5 from "p5";
import {Cell} from './cell';


const App = () => {

    const CELL_WIDTH: number = 10;
    const CELL_HEIGHT: number = 10;
    const width: number = window.innerWidth;
    const height: number = window.innerHeight;
    const cellsPerRow: number = Math.floor(width/CELL_WIDTH);
    const cellsPerColumn: number = Math.floor(height/CELL_HEIGHT);

    const cells: Cell[][] = [];

    //is the game running
    let running = false;

    // @ts-ignore
    const setup = (p5, canvasParentRef): void => {

        const canvas = p5.createCanvas(width, height).parent(canvasParentRef);
        canvas.mousePressed((event: boolean) => {
            if(running) return;
            const x = Math.floor(p5.mouseX/CELL_WIDTH);
            const y = Math.floor(p5.mouseY/CELL_HEIGHT);
            cells[x][y].setActive(!cells[x][y].isActive());
        })

        p5.frameRate(10)

        for (let i = 0; i < cellsPerRow; i++) {
            cells.push([]);
            for (let j = 0; j < cellsPerColumn; j++) {
                cells[i].push(new Cell(i, j, CELL_WIDTH, CELL_HEIGHT));
            }
        }
    };

    //rules directly taken from https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
    const updateCellState = (c: Cell) => {
        //get cached neighbour count;
        const neighbourCount = c.getActiveNeighbourCount();
        if(c.isActive())
        {
            //Any live cell with two or three live neighbours lives on to the next generation.
            if(neighbourCount == 2 || neighbourCount == 3)
            {
                return;
            }
            // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            if(neighbourCount < 2)
            {
                c.setActive(false);
            }
            //Any live cell with more than three live neighbours dies, as if by overpopulation.
            if(neighbourCount > 3)
            {
                c.setActive(false);
            }

        }
        else
        {
            // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            if(neighbourCount == 3)
            {
                c.setActive(true);
            }
        }

    }

    const getActiveNeighbourCount = (c: Cell) : number => {
        let activeNeighbours = 0;
        const row = c.getRow();
        const col = c.getCol();

        if(row >= 1 && col >= 1 && cells[row - 1][col - 1].isActive()) activeNeighbours++;
        if(row >= 1 && cells[row - 1][col].isActive()) activeNeighbours++;
        if(row >= 1 && col < cellsPerColumn - 1 && cells[row - 1][col + 1].isActive()) activeNeighbours++;

        if(col >= 1 && cells[row][col - 1].isActive()) activeNeighbours++;
        if(col < cellsPerColumn - 1 && cells[row][col + 1].isActive()) activeNeighbours++;

        if(row < cellsPerRow - 1 && col >= 1 && cells[row + 1][col - 1].isActive()) activeNeighbours++;
        if(row < cellsPerRow - 1 && cells[row + 1][col].isActive()) activeNeighbours++;
        if(row < cellsPerRow - 1 && col < cellsPerColumn - 1 && cells[row + 1][col + 1].isActive()) activeNeighbours++;

        return activeNeighbours;
    }

    const updateCells = () : void => {
        cells.forEach((cellRow: Cell[]) => cellRow.forEach(c => c.setActiveNeighbourCount(getActiveNeighbourCount(c))));
        cells.forEach((cellRow: Cell[]) => cellRow.forEach(c => updateCellState(c)));
    };

    // @ts-ignore
    const draw = (p5) => {
        if(running)
        {
            updateCells();
        }
        p5.background(255);
        cells.forEach((cellRow: Cell[]) => cellRow.forEach(c => c.draw(p5)));
    }

    const toggleRunning = () => {
        running = !running;
    }

    const clearGrid = () => {
        cells.forEach((cellRow: Cell[]) => cellRow.forEach(c => c.setActive(false)));
    }

    // @ts-ignore
    return(
        <>
            <button onClick={toggleRunning} autoFocus={false}>Play/pause game</button>
            <button onClick={clearGrid} autoFocus={false}>Clear</button>

            <Sketch setup={setup} draw={draw}/>
        </>
        )
}

export default App;
