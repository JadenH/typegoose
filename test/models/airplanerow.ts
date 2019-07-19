import { User } from './user'
import { arrayProp, prop, options, Ref, Typegoose } from '../../src/typegoose';


@options({
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})
export class AirplaneSeat extends Typegoose {
    @prop({ required: true })
    seat: string;

    @prop({ ref: User })
    passenger: User;
}

export class VirtualAirplaneSeat extends Typegoose {
    @prop({ required: true })
    seat: string;

    @prop({ ref: User })
    passenger: User;
}

export class AirplaneRow extends Typegoose {
    @prop({ required: true })
    rowNumber: number;

    @arrayProp({ items: AirplaneSeat })
    seats: AirplaneSeat[];

    @arrayProp({ items: VirtualAirplaneSeat })
    virtualSeats: VirtualAirplaneSeat[]
}

export const model = new AirplaneRow().getModelForClass(AirplaneRow);
