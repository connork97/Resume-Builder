from flask import jsonify

ERRORS = {
    "BAD_REQUEST": {
        "status": 400,
        "message": "Invalid or incomplete request."
    },
    "UNAUTHORIZED": {
        "status": 401,
        "message": "User authentication required."
    },
    "FORBIDDEN": {
        "status": 403,
        "message": "You do not have permission to perform this action."
    },
    "NOT_FOUND": {
        "status": 404,
        "message": "Resource not found."
    },
    "CONFLICT": {
        "status": 409,
        "message": "Conflict with existing data."
    },
    "VALIDATION_ERROR": {
        "status": 422,
        "message": "Validation failed."
    },
    "SERVER_ERROR": {
        "status": 500,
        "message": "Internal server error."
    },
}
   
def generate_error(error_type="SERVER_ERROR", code=None, message=None):
   error_type = (error_type or "SERVER_ERROR").upper()
   error_def = ERRORS.get(error_type, ERRORS["SERVER_ERROR"])

   return jsonify({
      "error": {
         "type": error_type,
         "code": code or error_type,
         "message": message or error_def["message"],
      }
   }), error_def["status"] or 400

def generate_success(success_type="OK", data=None, message=None, code=None, resource='Resource'):
    SUCCESS_DICT = {
        "OK": {"status": 200, 'code': 'SUCCESS', "message": "Request successful."},
        "CREATE": {"status": 201, 'code': 'CREATED_SUCCESSFULLY', "message": f"{resource} created successfully."},
        "UPDATE": {"status": 200, 'code': 'UPDATED_SUCCESSFULY', "message": f"{resource} updated successfully."},
        "DELETE": {"status": 200, 'code': 'DELETED_SUCCESSFULY', "message": f"{resource} deleted successfully."},
    }
    success_def = SUCCESS_DICT.get(success_type, SUCCESS_DICT["OK"])

    return (
        jsonify(
            {
                "success": {
                    "type": success_type,
                    "code": code or success_def['code'],
                    "message": message or success_def["message"],
                },
                "data": data,
            }
        ),
        success_def["status"],
    )
