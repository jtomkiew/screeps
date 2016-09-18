var translate = {
    errorCode: function(code) {
        var result;
        switch(code) {
            case ERR_NOT_OWNER:
                result = 'ERR_NOT_OWNER';
                break;
            case ERR_NO_PATH:
                result = 'ERR_NO_PATH';
                break;
            case ERR_NAME_EXISTS:
                result = 'ERR_NAME_EXISTS';
                break;
            case ERR_BUSY:
                result = 'ERR_BUSY';
                break;
            case ERR_NOT_FOUND:
                result = 'ERR_NOT_FOUND';
                break;
            case ERR_NOT_ENOUGH_ENERGY:
                result = 'ERR_NOT_ENOUGH_ENERGY';
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                result = 'ERR_NOT_ENOUGH_RESOURCES';
                break;
            case ERR_INVALID_TARGET:
                result = 'ERR_INVALID_TARGET';
                break;
            case ERR_FULL:
                result = 'ERR_FULL';
                break;
            case ERR_NOT_IN_RANGE:
                result = 'ERR_NOT_IN_RANGE';
                break;
            case ERR_INVALID_ARGS:
                result = 'ERR_INVALID_ARGS';
                break;
            case ERR_TIRED:
                result = 'ERR_TIRED';
                break;
            case ERR_NO_BODYPART:
                result = 'ERR_NO_BODYPART';
                break;
            case ERR_NOT_ENOUGH_EXTENSIONS:
                result = 'ERR_NOT_ENOUGH_EXTENSIONS';
                break;
            case ERR_RCL_NOT_ENOUGH:
                result = 'ERR_RCL_NOT_ENOUGH';
                break;
            case ERR_GCL_NOT_ENOUGH:
                result = 'ERR_GCL_NOT_ENOUGH';
        }
        return result;
    }
}

module.exports = translate;