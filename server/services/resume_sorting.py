from models import db, Resume


def apply_resume_sort(query, sort_by, default_order_by=None):

    # * Sort by Copy Count, Recently Created
    if sort_by == "copyCount":
        copy_counts = (
            db.session.query(
                Resume.source_resume_id,
                db.func.count(Resume.id).label("copy_count"),
            )
            .filter(Resume.source_resume_id.isnot(None))
            .group_by(Resume.source_resume_id)
            .subquery()
        )
        return query.outerjoin(
            copy_counts, copy_counts.c.source_resume_id == Resume.id
        ).order_by(
            db.func.coalesce(copy_counts.c.copy_count, 0).desc(),
            Resume.id.asc(),
        )

    if sort_by == "recent":
        return query.order_by(Resume.created_at.desc(), Resume.id.asc())

    if default_order_by is not None:
        return query.order_by(*default_order_by)

    return query.order_by(Resume.updated_at.desc(), Resume.id.asc())
