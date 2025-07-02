export interface Property {
    id?: string | undefined;
    title?: string | undefined;
    description?: string;
    address?: string;
    costAmount?: number;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    displayImage?: string;
    imageList?: string[];
    videoUrl?: string;
    listingType?: string;
    size?: number;
    quantity?: number;
    room?: number;
    toilet?: number;
    floor?: number;
    furnishing?: string;
    frequency?: string;
    amenities?: string[];
}

const formatProperty = (doc: any) => {
    return {
        ...doc.id && {id: doc.id},
        ...doc.title && {title: doc.title},
        ...doc.description && {description: doc.description},
        ...doc.address && {address: doc.address},
        ...doc.costAmount && {costAmount: doc.costAmount},
        ...doc.landmark && {landmark: doc.landmark},
        ...doc.latitude && {latitude: doc.latitude},
        ...doc.longitude && {longitude: doc.longitude},
        ...doc.displayImage && {displayImage: doc.displayImage},
        ...doc.imageList && {imageList: doc.imageList},
        ...doc.videoUrl && {videoUrl: doc.videoUrl},
        ...doc.listingType && {listingType: doc.listingType},
        ...doc.size && {size: doc.size},
        ...doc.quantity && {quantity: doc.quantity},
        ...doc.room && {room: doc.room},
        ...doc.toilet && {toilet: doc.toilet},
        ...doc.furnishing && {furnishing: doc.furnishing},
        ...doc.amenities && {amenities: doc.amenities},
    }
}

export {formatProperty}