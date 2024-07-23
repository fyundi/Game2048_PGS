export default class Mathf {
    public static readonly Deg2Rad: number = Math.PI * 2 / 360;
    // Radians-to-degrees conversion constant (RO).
    public static readonly Rad2Deg: number = 1 / Mathf.Deg2Rad;

    public static Sign(f: number): number { return f >= 0 ? 1 : -1; }

    public static Clamp01(value: number): number {
        if (value < 0)
            return 0;
        else if (value > 1)
            return 1;
        else
            return value;
    }

    public static Clamp(value: number, min: number, max: number): number {
        if (value < min)
            value = min;
        else if (value > max)
            value = max;
        return value;
    }

    // Loops the value t, so that it is never larger than length and never smaller than 0.
    public static Repeat(t: number, length: number): number {
        return this.Clamp(t - Math.floor(t / length) * length, 0.0, length);
    }

    // PingPongs the value t, so that it is never larger than length and never smaller than 0.
    public static PingPong(t: number, length: number): number {
        t = this.Repeat(t, length * 2);
        return length - Math.abs(t - length);
    }
}