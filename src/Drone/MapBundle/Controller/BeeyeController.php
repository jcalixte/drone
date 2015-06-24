<?php

namespace Drone\MapBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations\View;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class BeeyeController extends FOSRestController
{
	public function getDroneAction($id) {
		$drone = $this->getDoctrine()
		->getRepository('DroneMapBundle:Drone')
		->find($id);

		if (!$drone) {
			throw $this->createNotFoundException(
				'Aucun drone trouvé pour cet identifiant : ' . $id
			);
		}
		return $drone;
	}

	public function getDroneTestAction($id) {
		return true;
	}
}
