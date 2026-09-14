import json
from fastapi import APIRouter, Depends, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app import models
from app.services import usuarios_service

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("/me/datos", summary="Ver todos mis datos personales (Ley 25.326 art.14)")
def mis_datos(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    return usuarios_service.obtener_datos_usuario(db, current_user)


@router.get("/me/exportar", summary="Exportar mis datos como archivo JSON descargable")
def exportar_datos(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    datos = usuarios_service.obtener_datos_usuario(db, current_user)
    contenido = json.dumps(datos, ensure_ascii=False, indent=2, default=str)
    nombre_archivo = f"mis_datos_{current_user.id}.json"
    return Response(
        content=contenido.encode("utf-8"),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={nombre_archivo}"}
    )


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT, summary="Dar de baja mi cuenta (anonimizacion)")
def dar_de_baja(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    usuarios_service.dar_de_baja(db, current_user)
