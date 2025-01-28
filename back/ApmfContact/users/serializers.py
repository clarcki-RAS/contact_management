# users/serializers.py
from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    key_security_info = serializers.CharField(allow_blank=True, required=False)  # Ajoutez cela si vous voulez que le champ apparaisse dans le formulaire

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'service', 'role', 'location', 'password', 'key_security_info']

    def create(self, validated_data):
        key_security_info = validated_data.pop('key_security_info', None)
        
        # Créer l'utilisateur
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            service=validated_data['service'],
            role=validated_data['role'],
            location=validated_data['location'],
        )

        # Si le rôle est 'super_admin', ajouter la clé de sécurité
        if validated_data.get('role') == 'super_admin' and key_security_info:
            user.key_security_info = key_security_info

        user.save()
        return user
def create(self, validated_data):
    try:
        user = CustomUser.objects.create_user(**validated_data)
        return user
    except Exception as e:
        raise serializers.ValidationError({'detail': str(e)})
