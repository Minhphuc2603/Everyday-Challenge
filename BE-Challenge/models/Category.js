import mongoose, {Schema} from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        
    },
},{
    timestamps:true
}
)

const Categories = mongoose.model("categories", CategorySchema)

export default Categories;