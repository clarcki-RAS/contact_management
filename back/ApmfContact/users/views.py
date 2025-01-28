# users/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import RegisterSerializer

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            # Sauvegarder l'utilisateur
            user = serializer.save()

            # Retourner la réponse avec les informations de l'utilisateur créé
            return Response({
                "message": "Utilisateur créé avec succès",
                "user": {
                    "email": user.email,
                    "role": user.role
                }
            }, status=status.HTTP_201_CREATED)
        
        # Si des erreurs de validation sont présentes
        return Response({
            "message": "Il y a des erreurs dans les données fournies",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
# users/views.py
