from models import Resume
from utils.responses import generate_error


def check_resume_access(user_id, resume_id, request_method):

    resume = Resume.query.filter_by(id=resume_id).one_or_none()
    
    if resume is None:
        return generate_error(
            error_type="NOT_FOUND",
            code="RESUME_NOT_FOUND",
            message="The requested resume does not exist.",
        )
    
    user_is_resume_owner = user_id is not None and resume.user_id == user_id

    if request_method.upper() in {"GET", "HEAD"}:
        if resume.is_official_template or user_is_resume_owner:
            return None
        return generate_error(
            error_type="FORBIDDEN",
            code="RESUME_VIEW_FORBIDDEN",
            message="You are not authorized to view this resume.",
        )
            
    if not user_is_resume_owner:
        return generate_error(
            error_type="FORBIDDEN",
            code="RESUME_EDIT_FORBIDDEN",
            message="Only the owner can modify this resume.",
        )

    return None
