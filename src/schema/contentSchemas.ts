import ObjectType from '../validation/objectType';
import StringType from '../validation/stringType';
import NumberType from '../validation/numberType';
import ArrayType from '../validation/arrayType';

export const postDetails = new ObjectType({
    required: ['postId', 'title', 'publishTime'],
    properties: {
        postId: new StringType({
            minLength: 1,
            maxLength: 100,
        }),
        url: new StringType({
            format: 'url',
        }),
        title: new StringType({
            minLength: 1,
            maxLength: 100,
        }),
        tags: new ArrayType({
            items: new StringType({
                minLength: 1,
                maxLength: 50,
            }),
            minItems: 1,
            maxItems: 10,
        }),
        categories: new ArrayType({
            items: new StringType({
                minLength: 1,
                maxLength: 50,
            }),
            minItems: 1,
            maxItems: 10,
        }),
        authors: new ArrayType({
            items: new StringType({
                minLength: 1,
                maxLength: 50,
            }),
            minItems: 1,
            maxItems: 10,
        }),
        publishTime: new NumberType(),
        updateTime: new NumberType(),
    },
});
