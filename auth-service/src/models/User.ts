import mongoose , { Schema, Document } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password: string;
    role: 'user' | 'admin';
    refreshTokens: string[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}
const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    refreshTokens: {type:[String],default:[]}
}, { timestamps: true });

// pre save hook to hash password
UserSchema.pre("save", async function (next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// Menthod to compare password
UserSchema.methods.comparePassword = async function (candidatePassword:string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User',UserSchema);
