<?php

namespace Drone\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use Drone\MapBundle\Entity\Drone;

class AjaxController extends Controller
{
	public function saveDroneLocationAction() {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$request = $this->container->get('request');

		$lat = $request->get('lat');
		$lon = $request->get('lon');

		$drone = new Drone();
		$drone->setLatitude($lat)
			  ->setLongitude($lon)
			  ->setProduct('Parrot')
			  ->setSerialNumber($this->generateSerialNumber(20));

		$userManager = $this->container->get('fos_user.user_manager');
		$em = $this->getDoctrine()->getManager();
		$em->persist($drone);
		$em->flush();

		$user->addDrone($drone);
		$userManager->updateUser($user);

		$drones = $user->getDrones();

		$response = new JsonResponse();
		$response->setData(array(
			'serialNumber' => $drones[0]->getSerialNumber(),
			'latitude'     => $lat,
			'longitude'    => $lon,
		));
		return $response;
	}

	public function saveFieldLocationAction() {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$request = $this->container->get('request');

	}

	public function savePointLocationAction() {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$request = $this->container->get('request');

	}

	protected function generateSerialNumber($length = 10) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}
}
