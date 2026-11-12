"""
Roof Classification Module for TERRASCOPE

Classifies building roof types from extracted building footprint crops.
Categories: Flat, Pitched/Gabled, Hip, Dome, Metal Sheet, Thatched, RCC
"""

import torch
import torch.nn as nn
import torchvision.models as models


class RoofClassifier(nn.Module):
    """
    CNN-based roof type classifier using transfer learning.
    Uses a pre-trained ResNet-18 backbone with a custom classification head.

    Roof Categories:
        0: Flat / RCC
        1: Pitched / Gabled
        2: Hip
        3: Metal Sheet
        4: Thatched
        5: Dome
        6: Other / Unclassified
    """

    CATEGORIES = [
        "Flat / RCC",
        "Pitched / Gabled",
        "Hip",
        "Metal Sheet",
        "Thatched",
        "Dome",
        "Other",
    ]

    def __init__(self, n_classes: int = 7, pretrained: bool = True):
        super().__init__()
        self.n_classes = n_classes

        # Use ResNet-18 as backbone
        backbone = models.resnet18(
            weights=models.ResNet18_Weights.DEFAULT if pretrained else None
        )

        # Remove the final FC layer
        self.features = nn.Sequential(*list(backbone.children())[:-1])

        # Custom classification head
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(512, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.2),
            nn.Linear(128, n_classes),
        )

    def forward(self, x):
        features = self.features(x)
        return self.classifier(features)

    def predict(self, x):
        """Return predicted class index and confidence."""
        self.eval()
        with torch.no_grad():
            logits = self.forward(x)
            probs = torch.softmax(logits, dim=1)
            confidence, predicted = torch.max(probs, dim=1)
            return predicted, confidence

    def predict_with_label(self, x):
        """Return predicted class label and confidence."""
        predicted, confidence = self.predict(x)
        labels = [self.CATEGORIES[p.item()] for p in predicted]
        return labels, confidence.tolist()
