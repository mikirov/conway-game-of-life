import P5 from "p5";

interface ICell
{
    draw(p5: P5): void;
    setActive(state: boolean) : void;
    isActive() : boolean;
    getRow(): number;
    getCol(): number;
}

export class Cell implements ICell
{
    _i: number;
    _j: number;
    _width: number;
    _height: number;

    _active: boolean;

    _activeNeighbourCount: number;

    constructor(i: number, j: number, width: number, height: number)
    {
        this._i = i;
        this._j = j;
        this._width = width;
        this._height = height;

        this._active = false;
        this._activeNeighbourCount = 0;
    }

    setActive(state: boolean) : void
    {
        this._active = state
    }

    isActive(): boolean {
        return this._active;
    }

    setActiveNeighbourCount(value: number)
    {
        if(value > 0)
        {
            console.log(`cell neighbor count: ${value}`);
        }
        this._activeNeighbourCount = value;
    }

    getActiveNeighbourCount() : number
    {
        return this._activeNeighbourCount;
    }


    draw(p5: P5) : void
    {
        p5.rect(this._i * this._width, this._j * this._height, this._width, this._height).stroke(100, 255).fill(this._active ? 0 : 255,255,255);
    }

    getCol(): number {
        return this._j;
    }

    getRow(): number {
        return this._i;
    }
}
